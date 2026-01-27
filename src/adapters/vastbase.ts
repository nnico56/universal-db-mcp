/**
 * Vastbase 数据库适配器
 * 使用 pg 驱动实现 DbAdapter 接口
 * Vastbase 基于 PostgreSQL 开发，兼容 PostgreSQL 协议
 */

import pg from 'pg';
import type {
  DbAdapter,
  QueryResult,
  SchemaInfo,
  TableInfo,
  ColumnInfo,
  IndexInfo,
} from '../types/adapter.js';
import { isWriteOperation as checkWriteOperation } from '../utils/safety.js';

const { Client } = pg;

export class VastbaseAdapter implements DbAdapter {
  private client: pg.Client | null = null;
  private config: {
    host: string;
    port: number;
    user?: string;
    password?: string;
    database?: string;
  };

  constructor(config: {
    host: string;
    port: number;
    user?: string;
    password?: string;
    database?: string;
  }) {
    this.config = config;
  }

  /**
   * 连接到 Vastbase 数据库
   */
  async connect(): Promise<void> {
    try {
      this.client = new Client({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
      });

      await this.client.connect();

      // 测试连接
      await this.client.query('SELECT 1');
    } catch (error) {
      throw new Error(
        `Vastbase 连接失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 断开数据库连接
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  /**
   * 执行 SQL 查询
   */
  async executeQuery(query: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.client) {
      throw new Error('数据库未连接');
    }

    const startTime = Date.now();

    try {
      const result = await this.client.query(query, params);
      const executionTime = Date.now() - startTime;

      return {
        rows: result.rows,
        affectedRows: result.rowCount || 0,
        executionTime,
        metadata: {
          command: result.command,
          fields: result.fields?.map(f => ({
            name: f.name,
            dataTypeID: f.dataTypeID,
          })),
        },
      };
    } catch (error) {
      throw new Error(
        `查询执行失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取数据库结构信息
   */
  async getSchema(): Promise<SchemaInfo> {
    if (!this.client) {
      throw new Error('数据库未连接');
    }

    try {
      // 获取数据库版本
      const versionResult = await this.client.query('SELECT version() as version');
      const version = versionResult.rows[0]?.version || 'unknown';

      // 获取当前数据库名
      const databaseName = this.config.database || 'postgres';

      // 获取所有表（从 public schema）
      const tablesResult = await this.client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const tableInfos: TableInfo[] = [];

      for (const row of tablesResult.rows) {
        const tableInfo = await this.getTableInfo(row.table_name);
        tableInfos.push(tableInfo);
      }

      return {
        databaseType: 'vastbase',
        databaseName,
        tables: tableInfos,
        version,
      };
    } catch (error) {
      throw new Error(
        `获取数据库结构失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * 获取单个表的详细信息
   */
  private async getTableInfo(tableName: string): Promise<TableInfo> {
    if (!this.client) {
      throw new Error('数据库未连接');
    }

    // 获取列信息
    const columnsResult = await this.client.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);

    const columnInfos: ColumnInfo[] = columnsResult.rows.map((col) => {
      let dataType = col.data_type;
      if (col.character_maximum_length) {
        dataType += `(${col.character_maximum_length})`;
      } else if (col.numeric_precision) {
        dataType += `(${col.numeric_precision}${col.numeric_scale ? `,${col.numeric_scale}` : ''})`;
      }

      return {
        name: col.column_name,
        type: dataType,
        nullable: col.is_nullable === 'YES',
        defaultValue: col.column_default || undefined,
      };
    });

    // 获取主键信息
    const primaryKeyResult = await this.client.query(`
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = $1::regclass
        AND i.indisprimary
    `, [tableName]);

    const primaryKeys = primaryKeyResult.rows.map(row => row.attname);

    // 获取索引信息
    const indexesResult = await this.client.query(`
      SELECT
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique
      FROM pg_class t
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      WHERE t.relname = $1
        AND t.relkind = 'r'
        AND NOT ix.indisprimary
      ORDER BY i.relname, a.attnum
    `, [tableName]);

    const indexMap = new Map<string, { columns: string[]; unique: boolean }>();

    for (const row of indexesResult.rows) {
      if (!indexMap.has(row.index_name)) {
        indexMap.set(row.index_name, {
          columns: [],
          unique: row.is_unique,
        });
      }
      indexMap.get(row.index_name)!.columns.push(row.column_name);
    }

    const indexInfos: IndexInfo[] = Array.from(indexMap.entries()).map(
      ([name, info]) => ({
        name,
        columns: info.columns,
        unique: info.unique,
      })
    );

    // 获取表行数估算
    const countResult = await this.client.query(`
      SELECT reltuples::bigint as estimate
      FROM pg_class
      WHERE relname = $1
    `, [tableName]);

    const estimatedRows = parseInt(countResult.rows[0]?.estimate || '0', 10);

    return {
      name: tableName,
      columns: columnInfos,
      primaryKeys,
      indexes: indexInfos,
      estimatedRows,
    };
  }

  /**
   * 检查是否为写操作
   */
  isWriteOperation(query: string): boolean {
    return checkWriteOperation(query);
  }
}

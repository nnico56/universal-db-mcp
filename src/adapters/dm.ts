/**
 * 达梦数据库适配器
 * 达梦数据库高度兼容 Oracle，使用类似的 API 和系统视图
 *
 * dmdb 驱动会作为可选依赖自动安装
 */

import type {
  DbAdapter,
  QueryResult,
  SchemaInfo,
  TableInfo,
  ColumnInfo,
  IndexInfo,
} from '../types/adapter.js';
import { isWriteOperation as checkWriteOperation } from '../utils/safety.js';

// 动态导入 dmdb，因为它是可选依赖
let dmdb: any = null;

async function loadDMDB() {
  if (dmdb) {
    return dmdb;
  }

  try {
    // @ts-ignore - dmdb 是可选依赖，可能未安装
    const module = await import('dmdb');
    dmdb = module.default || module;
    return dmdb;
  } catch (error) {
    throw new Error(
      '达梦数据库驱动未安装。\n' +
      '请运行以下命令安装：npm install dmdb\n' +
      '或者全局安装：npm install -g dmdb'
    );
  }
}

export class DMAdapter implements DbAdapter {
  private connection: any = null;
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
   * 连接到达梦数据库
   */
  async connect(): Promise<void> {
    try {
      const DM = await loadDMDB();

      // 达梦数据库连接配置
      const connectionConfig = {
        host: this.config.host,
        port: this.config.port || 5236, // 达梦默认端口
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        // 禁用消息加密以避免 OpenSSL 3.0 兼容性问题
        // 如果需要加密连接，请确保达梦数据库服务器配置了兼容的加密算法
        cipherPath: '',
        loginEncrypt: false,
      };

      this.connection = await DM.getConnection(connectionConfig);

      // 测试连接
      await this.connection.execute('SELECT 1 FROM DUAL', []);
    } catch (error: any) {
      // 翻译常见错误
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('用户名') || errorMessage.includes('密码')) {
        throw new Error('达梦数据库连接失败: 用户名或密码无效');
      } else if (errorMessage.includes('连接') || errorMessage.includes('网络')) {
        throw new Error('达梦数据库连接失败: 无法连接到数据库服务器，请检查主机地址和端口');
      }

      throw new Error(`达梦数据库连接失败: ${errorMessage}`);
    }
  }

  /**
   * 断开数据库连接
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        // 忽略关闭连接时的错误
      }
      this.connection = null;
    }
  }

  /**
   * 执行 SQL 查询
   */
  async executeQuery(query: string, params?: unknown[]): Promise<QueryResult> {
    if (!this.connection) {
      throw new Error('数据库未连接');
    }

    const startTime = Date.now();

    try {
      // 执行查询
      const result = await this.connection.execute(query, params || [], {
        autoCommit: false,
      });

      const executionTime = Date.now() - startTime;

      // 处理查询结果
      if (result.rows && result.rows.length > 0) {
        // SELECT 查询 - 将列名转换为小写
        const rows = result.rows.map((row: any) => {
          const lowerCaseRow: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(row)) {
            lowerCaseRow[key.toLowerCase()] = value;
          }
          return lowerCaseRow;
        });

        return {
          rows,
          executionTime,
          metadata: {
            columnCount: result.metaData?.length || 0,
          },
        };
      } else if (result.rowsAffected !== undefined && result.rowsAffected > 0) {
        // DML 操作 (INSERT/UPDATE/DELETE)
        return {
          rows: [],
          affectedRows: result.rowsAffected,
          executionTime,
        };
      } else {
        // 其他操作或空结果
        return {
          rows: [],
          executionTime,
        };
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('表') || errorMessage.includes('视图')) {
        throw new Error('查询执行失败: 表或视图不存在');
      } else if (errorMessage.includes('约束')) {
        throw new Error('查询执行失败: 违反唯一约束');
      }

      throw new Error(`查询执行失败: ${errorMessage}`);
    }
  }

  /**
   * 获取数据库结构信息
   */
  async getSchema(): Promise<SchemaInfo> {
    if (!this.connection) {
      throw new Error('数据库未连接');
    }

    try {
      // 获取达梦数据库版本
      const versionResult = await this.connection.execute(
        `SELECT BANNER FROM V$VERSION WHERE ROWNUM = 1`,
        []
      );
      const version = versionResult.rows?.[0]
        ? Object.values(versionResult.rows[0])[0] as string
        : 'unknown';

      // 获取当前用户
      const userResult = await this.connection.execute('SELECT USER FROM DUAL', []);
      const databaseName = userResult.rows?.[0]
        ? Object.values(userResult.rows[0])[0] as string
        : 'unknown';

      // 获取所有表
      const tablesResult = await this.connection.execute(
        `SELECT TABLE_NAME, NUM_ROWS
         FROM USER_TABLES
         ORDER BY TABLE_NAME`,
        []
      );

      const tableInfos: TableInfo[] = [];

      if (tablesResult.rows) {
        for (const tableRow of tablesResult.rows) {
          const tableName = (tableRow as any).TABLE_NAME;
          const tableInfo = await this.getTableInfo(tableName);
          tableInfos.push(tableInfo);
        }
      }

      return {
        databaseType: 'dm',
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
    if (!this.connection) {
      throw new Error('数据库未连接');
    }

    // 获取列信息
    const columnsResult = await this.connection.execute(
      `SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, DATA_PRECISION,
              DATA_SCALE, NULLABLE, DATA_DEFAULT, COLUMN_ID
       FROM USER_TAB_COLUMNS
       WHERE TABLE_NAME = :1
       ORDER BY COLUMN_ID`,
      [tableName]
    );

    const columnInfos: ColumnInfo[] = [];
    if (columnsResult.rows) {
      for (const col of columnsResult.rows) {
        const colData = col as any;
        columnInfos.push({
          name: colData.COLUMN_NAME.toLowerCase(),
          type: this.formatDMType(
            colData.DATA_TYPE,
            colData.DATA_LENGTH,
            colData.DATA_PRECISION,
            colData.DATA_SCALE
          ),
          nullable: colData.NULLABLE === 'Y',
          defaultValue: colData.DATA_DEFAULT?.trim() || undefined,
        });
      }
    }

    // 获取列注释
    const commentsResult = await this.connection.execute(
      `SELECT COLUMN_NAME, COMMENTS
       FROM USER_COL_COMMENTS
       WHERE TABLE_NAME = :1
         AND COMMENTS IS NOT NULL`,
      [tableName]
    );

    const commentsMap = new Map<string, string>();
    if (commentsResult.rows) {
      for (const row of commentsResult.rows) {
        const rowData = row as any;
        commentsMap.set(
          rowData.COLUMN_NAME.toLowerCase(),
          rowData.COMMENTS
        );
      }
    }

    // 将注释添加到列信息中
    for (const col of columnInfos) {
      if (commentsMap.has(col.name)) {
        col.comment = commentsMap.get(col.name);
      }
    }

    // 获取主键
    const primaryKeysResult = await this.connection.execute(
      `SELECT cols.COLUMN_NAME, cols.POSITION
       FROM USER_CONSTRAINTS cons
       JOIN USER_CONS_COLUMNS cols
         ON cons.CONSTRAINT_NAME = cols.CONSTRAINT_NAME
       WHERE cons.CONSTRAINT_TYPE = 'P'
         AND cons.TABLE_NAME = :1
       ORDER BY cols.POSITION`,
      [tableName]
    );

    const primaryKeys: string[] = [];
    if (primaryKeysResult.rows) {
      for (const row of primaryKeysResult.rows) {
        primaryKeys.push((row as any).COLUMN_NAME.toLowerCase());
      }
    }

    // 获取索引信息
    const indexesResult = await this.connection.execute(
      `SELECT i.INDEX_NAME, i.UNIQUENESS, ic.COLUMN_NAME, ic.COLUMN_POSITION
       FROM USER_INDEXES i
       JOIN USER_IND_COLUMNS ic
         ON i.INDEX_NAME = ic.INDEX_NAME
       WHERE i.TABLE_NAME = :1
       ORDER BY i.INDEX_NAME, ic.COLUMN_POSITION`,
      [tableName]
    );

    const indexMap = new Map<string, { columns: string[]; unique: boolean }>();
    if (indexesResult.rows) {
      for (const row of indexesResult.rows) {
        const rowData = row as any;
        const indexName = rowData.INDEX_NAME;

        // 跳过主键索引
        if (indexName.includes('PK_') || indexName.includes('SYS_')) {
          continue;
        }

        if (!indexMap.has(indexName)) {
          indexMap.set(indexName, {
            columns: [],
            unique: rowData.UNIQUENESS === 'UNIQUE',
          });
        }

        indexMap.get(indexName)!.columns.push(rowData.COLUMN_NAME.toLowerCase());
      }
    }

    const indexInfos: IndexInfo[] = Array.from(indexMap.entries()).map(
      ([name, info]) => ({
        name,
        columns: info.columns,
        unique: info.unique,
      })
    );

    // 获取表行数估算
    const rowCountResult = await this.connection.execute(
      `SELECT NUM_ROWS FROM USER_TABLES WHERE TABLE_NAME = :1`,
      [tableName]
    );

    const estimatedRows = rowCountResult.rows?.[0]
      ? ((rowCountResult.rows[0] as any).NUM_ROWS || 0)
      : 0;

    return {
      name: tableName.toLowerCase(),
      columns: columnInfos,
      primaryKeys,
      indexes: indexInfos,
      estimatedRows,
    };
  }

  /**
   * 格式化达梦数据类型
   */
  private formatDMType(
    dataType: string,
    length?: number,
    precision?: number,
    scale?: number
  ): string {
    switch (dataType) {
      case 'NUMBER':
      case 'NUMERIC':
      case 'DECIMAL':
        if (precision !== null && precision !== undefined) {
          if (scale !== null && scale !== undefined && scale > 0) {
            return `${dataType}(${precision},${scale})`;
          }
          return `${dataType}(${precision})`;
        }
        return dataType;

      case 'VARCHAR':
      case 'VARCHAR2':
      case 'CHAR':
        if (length) {
          return `${dataType}(${length})`;
        }
        return dataType;

      case 'TIMESTAMP':
        if (scale !== null && scale !== undefined) {
          return `TIMESTAMP(${scale})`;
        }
        return 'TIMESTAMP';

      default:
        return dataType;
    }
  }

  /**
   * 检查是否为写操作
   */
  isWriteOperation(query: string): boolean {
    // 首先使用通用的写操作检测
    if (checkWriteOperation(query)) {
      return true;
    }

    // 添加达梦特定的写操作检测（类似 Oracle）
    const trimmedQuery = query.trim().toUpperCase();

    // MERGE 语句（达梦支持）
    if (trimmedQuery.startsWith('MERGE')) {
      return true;
    }

    // PL/SQL 块（达梦兼容 Oracle PL/SQL）
    if (trimmedQuery.startsWith('BEGIN') || trimmedQuery.startsWith('DECLARE')) {
      return true;
    }

    // CALL 存储过程
    if (trimmedQuery.startsWith('CALL')) {
      return true;
    }

    // 事务控制语句
    if (trimmedQuery.startsWith('COMMIT') || trimmedQuery.startsWith('ROLLBACK')) {
      return true;
    }

    return false;
  }
}

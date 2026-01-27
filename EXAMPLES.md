# 使用示例

本文档提供 MCP 数据库万能连接器的详细使用示例。

## 📋 目录

- [MySQL 使用示例](#mysql-使用示例)
- [PostgreSQL 使用示例](#postgresql-使用示例)
- [Redis 使用示例](#redis-使用示例)
- [Oracle 使用示例](#oracle-使用示例)
- [达梦 使用示例](#达梦-使用示例)
- [SQL Server 使用示例](#sql-server-使用示例)
- [MongoDB 使用示例](#mongodb-使用示例)
- [SQLite 使用示例](#sqlite-使用示例)
- [KingbaseES 使用示例](#kingbasees-使用示例)
- [GaussDB / OpenGauss 使用示例](#gaussdb--opengauss-使用示例)
- [OceanBase 使用示例](#oceanbase-使用示例)
- [TiDB 使用示例](#tidb-使用示例)
- [ClickHouse 使用示例](#clickhouse-使用示例)
- [PolarDB 使用示例](#polardb-使用示例)
- [Vastbase 使用示例](#vastbase-使用示例)
- [HighGo 使用示例](#highgo-使用示例)
- [GoldenDB 使用示例](#goldendb-使用示例)
- [Claude Desktop 配置示例](#claude-desktop-配置示例)
- [常见使用场景](#常见使用场景)

---

## MySQL 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "mysql-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mysql",
        "--host", "localhost",
        "--port", "3306",
        "--user", "root",
        "--password", "your_password",
        "--database", "myapp_db"
      ]
    }
  }
}
```

### 启用写入模式（谨慎使用）

```json
{
  "mcpServers": {
    "mysql-dev": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mysql",
        "--host", "localhost",
        "--port", "3306",
        "--user", "dev_user",
        "--password", "dev_password",
        "--database", "dev_database",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 帮我查看 users 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 返回表的列信息、主键、索引等

**用户**: 统计最近 7 天注册的用户数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
3. 调用 `execute_query` 工具执行
4. 返回结果

---

## PostgreSQL 使用示例

### 基础配置

```json
{
  "mcpServers": {
    "postgres-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "postgres",
        "--host", "localhost",
        "--port", "5432",
        "--user", "postgres",
        "--password", "your_password",
        "--database", "myapp"
      ]
    }
  }
}
```

### 连接远程数据库

```json
{
  "mcpServers": {
    "postgres-prod": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "postgres",
        "--host", "db.example.com",
        "--port", "5432",
        "--user", "readonly_user",
        "--password", "secure_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 找出订单金额最高的 10 个客户

**Claude 会自动**:
1. 调用 `get_schema` 了解表结构
2. 生成复杂的 JOIN 查询
3. 执行并返回结果

---

## Redis 使用示例

### 基础配置（无密码）

```json
{
  "mcpServers": {
    "redis-cache": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "redis",
        "--host", "localhost",
        "--port", "6379"
      ]
    }
  }
}
```

### 带密码和数据库选择

```json
{
  "mcpServers": {
    "redis-session": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "redis",
        "--host", "localhost",
        "--port", "6379",
        "--password", "redis_password",
        "--database", "1"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看所有以 "user:" 开头的键

**Claude 会执行**: `KEYS user:*`

**用户**: 获取 user:1001 的信息

**Claude 会执行**: `GET user:1001` 或 `HGETALL user:1001`（根据数据类型）

---

## Oracle 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "oracle-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oracle",
        "--host", "localhost",
        "--port", "1521",
        "--user", "system",
        "--password", "your_password",
        "--database", "XEPDB1"
      ]
    }
  }
}
```

### 使用 Service Name 连接

```json
{
  "mcpServers": {
    "oracle-prod": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oracle",
        "--host", "oracle-server.example.com",
        "--port", "1521",
        "--user", "app_user",
        "--password", "secure_password",
        "--database", "ORCL"
      ]
    }
  }
}
```

### 启用写入模式（谨慎使用）

```json
{
  "mcpServers": {
    "oracle-dev": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oracle",
        "--host", "localhost",
        "--port", "1521",
        "--user", "dev_user",
        "--password", "dev_password",
        "--database", "DEVDB",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 帮我查看 EMPLOYEES 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 返回表的列信息、主键、索引等
3. 注意：Oracle 表名通常为大写

**用户**: 查询工资最高的 10 名员工

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT * FROM EMPLOYEES ORDER BY SALARY DESC FETCH FIRST 10 ROWS ONLY`
3. 调用 `execute_query` 工具执行
4. 返回结果

**用户**: 统计每个部门的员工数量

**Claude 会自动**:
1. 查看表结构
2. 生成 SQL: `SELECT DEPARTMENT_ID, COUNT(*) as EMP_COUNT FROM EMPLOYEES GROUP BY DEPARTMENT_ID`
3. 执行并返回结果



## 达梦 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "dm-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "dm",
        "--host", "localhost",
        "--port", "5236",
        "--user", "SYSDBA",
        "--password", "SYSDBA",
        "--database", "DAMENG"
      ]
    }
  }
}
```

**注意**: 达梦数据库驱动 `dmdb` 会作为可选依赖自动安装。如果安装失败，请手动运行：

```bash
npm install -g dmdb
```

### 连接远程达梦数据库

```json
{
  "mcpServers": {
    "dm-prod": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "dm",
        "--host", "dm-server.example.com",
        "--port", "5236",
        "--user", "app_user",
        "--password", "secure_password",
        "--database", "PRODUCTION"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中的所有表

**Claude 会自动**:

1. 调用 `get_schema` 工具
2. 返回所有表的列表和基本信息

**用户**: 查询部门表中的所有记录

**Claude 会自动**:

1. 生成 SQL: `SELECT * FROM DEPT`
2. 执行查询并返回结果

**用户**: 统计每个部门的员工数量

**Claude 会自动**:

1. 理解需求
2. 生成 SQL: `SELECT DEPT_ID, COUNT(*) as EMP_COUNT FROM EMPLOYEES GROUP BY DEPT_ID`
3. 执行并返回结果

---

## SQL Server 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "sqlserver-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlserver",
        "--host", "localhost",
        "--port", "1433",
        "--user", "sa",
        "--password", "YourPassword123",
        "--database", "master"
      ]
    }
  }
}
```

**提示**: 也可以使用 `--type mssql` 作为别名。

### 启用写入模式

```json
{
  "mcpServers": {
    "sqlserver-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlserver",
        "--host", "localhost",
        "--port", "1433",
        "--user", "sa",
        "--password", "YourPassword123",
        "--database", "MyDatabase",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 Azure SQL Database

```json
{
  "mcpServers": {
    "azure-sql": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlserver",
        "--host", "myserver.database.windows.net",
        "--port", "1433",
        "--user", "myadmin",
        "--password", "MyPassword123!",
        "--database", "mydatabase"
      ]
    }
  }
}
```

**注意**: 连接 Azure SQL Database 时会自动启用加密连接。

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:

1. 调用 `get_schema` 工具
2. 执行查询: `SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
3. 返回表列表

**用户**: 查看 Users 表的结构

**Claude 会自动**:

1. 调用 `get_table_info` 工具
2. 返回列信息、主键、索引等详细信息

**用户**: 统计每个部门的员工数量

**Claude 会自动**:

1. 理解需求
2. 生成 SQL: `SELECT DepartmentID, COUNT(*) as EmployeeCount FROM Employees GROUP BY DepartmentID ORDER BY EmployeeCount DESC`
3. 执行并返回结果

**用户**: 查找最近一周创建的订单

**Claude 会自动**:

1. 生成 SQL: `SELECT * FROM Orders WHERE CreatedDate >= DATEADD(day, -7, GETDATE()) ORDER BY CreatedDate DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: SQL Server 默认端口为 1433
2. **身份验证**: 支持 SQL Server 身份验证（用户名/密码）
3. **加密连接**: 连接 Azure SQL 时会自动启用加密，本地 SQL Server 默认不加密
4. **数据库名**: 必须指定数据库名（如 master、tempdb 或自定义数据库）
5. **权限**: 确保用户有足够的权限访问系统视图（INFORMATION_SCHEMA）
6. **参数化查询**: 支持 `?` 占位符,会自动转换为 SQL Server 的 `@param0` 语法

---

## MongoDB 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "mongodb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mongodb",
        "--host", "localhost",
        "--port", "27017",
        "--user", "admin",
        "--password", "your_password",
        "--database", "myapp",
        "--auth-source", "admin"  
      ]
    }
  }
}
```

### 无认证连接（开发环境）

```json
{
  "mcpServers": {
    "mongodb-local": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mongodb",
        "--host", "localhost",
        "--port", "27017",
        "--database", "test"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "mongodb-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mongodb",
        "--host", "localhost",
        "--port", "27017",
        "--user", "dev_user",
        "--password", "dev_password",
        "--database", "development",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 MongoDB Atlas

```json
{
  "mcpServers": {
    "mongodb-atlas": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mongodb",
        "--host", "cluster0.xxxxx.mongodb.net",
        "--port", "27017",
        "--user", "myuser",
        "--password", "mypassword",
        "--database", "production"
      ]
    }
  }
}
```

### 查询格式

MongoDB 适配器支持两种查询格式：

#### 1. JSON 格式（推荐）

```json
{
  "collection": "users",
  "operation": "find",
  "query": {"age": {"$gt": 18}},
  "options": {"limit": 10}
}
```

#### 2. 简化格式

```javascript
db.users.find({"age": {"$gt": 18}})
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些集合？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 返回所有集合的列表和基本信息
3. 显示每个集合的文档数量和推断的字段结构

**用户**: 查询 users 集合中年龄大于 18 的用户

**Claude 会自动**:
1. 生成查询: `{"collection": "users", "operation": "find", "query": {"age": {"$gt": 18}}}`
2. 执行并返回结果

**用户**: 统计每个城市的用户数量

**Claude 会自动**:
1. 理解需求
2. 生成聚合查询:
```json
{
  "collection": "users",
  "operation": "aggregate",
  "pipeline": [
    {"$group": {"_id": "$city", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
  ]
}
```
3. 执行并返回结果

**用户**: 查找最近创建的 10 个订单

**Claude 会自动**:
1. 生成查询:
```json
{
  "collection": "orders",
  "operation": "find",
  "query": {},
  "options": {"sort": {"createdAt": -1}, "limit": 10}
}
```
2. 执行并返回结果

### 支持的操作

#### 查询操作（只读模式）
- `find` - 查询文档
- `findOne` - 查询单个文档
- `count` / `countDocuments` - 统计文档数量
- `distinct` - 获取字段的不同值
- `aggregate` - 聚合管道查询

#### 写入操作（需要 --danger-allow-write）
- `insert` / `insertOne` - 插入单个文档
- `insertMany` - 插入多个文档
- `update` / `updateOne` - 更新单个文档
- `updateMany` - 更新多个文档
- `delete` / `deleteOne` - 删除单个文档
- `deleteMany` - 删除多个文档

### 注意事项

1. **默认端口**: MongoDB 默认端口为 27017
2. **认证**: 支持用户名/密码认证，默认认证数据库为 admin
3. **集合结构**: MongoDB 是无模式数据库，Schema 信息通过采样文档推断
4. **ObjectId**: 查询结果中的 ObjectId 会自动转换为字符串
5. **查询语法**: 使用 MongoDB 原生查询语法，不是 SQL
6. **聚合管道**: 支持完整的聚合管道功能

---

## SQLite 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "sqlite-local": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlite",
        "--file", "/path/to/your/database.db"
      ]
    }
  }
}
```

### Windows 路径示例

```json
{
  "mcpServers": {
    "sqlite-app": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlite",
        "--file", "C:\\Users\\YourName\\Documents\\myapp.db"
      ]
    }
  }
}
```

**注意**: Windows 路径中的反斜杠需要转义（使用 `\\`）。

### macOS/Linux 路径示例

```json
{
  "mcpServers": {
    "sqlite-notes": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlite",
        "--file", "/Users/YourName/Documents/notes.db"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "sqlite-dev": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlite",
        "--file", "/path/to/dev.db",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行查询: `SELECT name FROM sqlite_master WHERE type='table'`
3. 返回表列表

**用户**: 查看 users 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 执行 `PRAGMA table_info(users)`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个分类的文章数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT category, COUNT(*) as count FROM articles GROUP BY category ORDER BY count DESC`
3. 执行并返回结果

**用户**: 查找最近创建的 10 条记录

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM posts ORDER BY created_at DESC LIMIT 10`
2. 执行并返回结果

### 常见使用场景

#### 1. 分析本地应用数据库

许多桌面应用使用 SQLite 存储数据（如浏览器历史、笔记应用等）：

```
用户: 帮我分析 Chrome 浏览器的历史记录

Claude 会:
1. 连接到 Chrome 的 History 数据库文件
2. 查询 urls 和 visits 表
3. 生成访问统计和分析报告
```

#### 2. 开发和测试

SQLite 非常适合本地开发和测试：

```
用户: 创建一个测试用户并查询

Claude 会（在写入模式下）:
1. INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com')
2. SELECT * FROM users WHERE email = 'test@example.com'
```

#### 3. 数据导出和备份

```
用户: 导出所有用户数据为 JSON 格式

Claude 会:
1. SELECT * FROM users
2. 将结果格式化为 JSON
3. 提供下载或复制
```

### 注意事项

1. **文件路径**: 必须使用绝对路径，不支持相对路径
2. **文件权限**: 确保 Claude Desktop 有权限读取/写入数据库文件
3. **并发访问**: SQLite 支持多读单写，注意并发访问限制
4. **数据库锁**: 如果数据库被其他程序占用，可能会遇到锁定错误
5. **自动创建**: 如果指定的文件不存在，会自动创建新数据库
6. **备份建议**: 在启用写入模式前，建议先备份数据库文件

### 支持的 SQLite 特性

- ✅ 标准 SQL 查询（SELECT、INSERT、UPDATE、DELETE）
- ✅ 事务支持
- ✅ 索引和主键
- ✅ 外键约束（需要启用）
- ✅ PRAGMA 命令
- ✅ 全文搜索（FTS）
- ✅ JSON 扩展（SQLite 3.38+）

### 性能提示

1. **索引优化**: 为常用查询字段创建索引
2. **批量操作**: 使用事务包装批量 INSERT/UPDATE
3. **PRAGMA 优化**: 可以使用 PRAGMA 命令调整性能参数
4. **VACUUM**: 定期执行 VACUUM 优化数据库文件大小

---

## KingbaseES 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "kingbase-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "kingbase",
        "--host", "localhost",
        "--port", "54321",
        "--user", "system",
        "--password", "your_password",
        "--database", "test"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "kingbase-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "kingbase",
        "--host", "localhost",
        "--port", "54321",
        "--user", "system",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接远程 KingbaseES

```json
{
  "mcpServers": {
    "kingbase-prod": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "kingbase",
        "--host", "kingbase.example.com",
        "--port", "54321",
        "--user", "readonly_user",
        "--password", "secure_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行查询获取 public schema 下的所有表
3. 返回表列表

**用户**: 查看 users 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 返回列信息、主键、索引等详细信息

**用户**: 统计每个部门的员工数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT department_id, COUNT(*) as count FROM employees GROUP BY department_id ORDER BY count DESC`
3. 执行并返回结果

**用户**: 查找最近一周创建的订单

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' ORDER BY created_at DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: KingbaseES 默认端口为 54321
2. **兼容性**: 基于 PostgreSQL 开发，兼容 PostgreSQL 协议和 SQL 语法
3. **驱动**: 使用 PostgreSQL 的 `pg` 驱动
4. **Schema**: 默认查询 public schema 下的表
5. **参数化查询**: 支持 `$1, $2, ...` 占位符
6. **国产化**: 适用于国产化替代场景

### 支持的 KingbaseES 版本

- ✅ KingbaseES V8
- ✅ KingbaseES V9
- ✅ 其他兼容 PostgreSQL 协议的版本

### 常见使用场景

#### 1. 国产化数据库迁移

从 PostgreSQL 迁移到 KingbaseES：

```
用户: 帮我分析现有表结构，准备迁移到 KingbaseES

Claude 会:
1. 获取完整的 Schema 信息
2. 分析表结构、索引、约束
3. 提供迁移建议
```

#### 2. 数据分析和报表

```
用户: 统计最近一个月的销售数据

Claude 会:
1. 理解需求
2. 生成复杂的聚合查询
3. 返回分析结果
```

#### 3. 开发和测试

```
用户: 在测试环境创建测试数据

Claude 会（在写入模式下）:
1. 生成 INSERT 语句
2. 执行并验证结果
```

---

## GaussDB / OpenGauss 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "gaussdb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "gaussdb",
        "--host", "localhost",
        "--port", "5432",
        "--user", "gaussdb",
        "--password", "your_password",
        "--database", "postgres"
      ]
    }
  }
}
```

**提示**: 也可以使用 `--type opengauss` 作为别名。

### 启用写入模式

```json
{
  "mcpServers": {
    "gaussdb-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "gaussdb",
        "--host", "localhost",
        "--port", "5432",
        "--user", "gaussdb",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接华为云 GaussDB

```json
{
  "mcpServers": {
    "gaussdb-cloud": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "gaussdb",
        "--host", "gaussdb.cn-north-4.myhuaweicloud.com",
        "--port", "5432",
        "--user", "dbuser",
        "--password", "secure_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行查询获取 public schema 下的所有表
3. 返回表列表

**用户**: 查看 products 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 返回列信息、主键、索引等详细信息

**用户**: 统计每个类别的产品数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC`
3. 执行并返回结果

**用户**: 查找价格最高的 10 个产品

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM products ORDER BY price DESC LIMIT 10`
2. 执行并返回结果

### 注意事项

1. **默认端口**: GaussDB/OpenGauss 默认端口为 5432（与 PostgreSQL 相同）
2. **兼容性**: 基于 PostgreSQL 9.2 开发，兼容 PostgreSQL 协议和大部分 SQL 语法
3. **驱动**: 使用 PostgreSQL 的 `pg` 驱动
4. **Schema**: 默认查询 public schema 下的表
5. **参数化查询**: 支持 `$1, $2, ...` 占位符
6. **国产化**: 华为自研数据库，适用于国产化替代场景
7. **开源版本**: OpenGauss 是 GaussDB 的开源版本

### 支持的版本

- ✅ GaussDB 100/200/300 系列
- ✅ OpenGauss 2.x / 3.x / 5.x
- ✅ 其他兼容 PostgreSQL 协议的版本

### 常见使用场景

#### 1. 华为云数据库管理

连接华为云 GaussDB 进行数据查询和分析：

```
用户: 帮我分析最近一周的用户增长趋势

Claude 会:
1. 查询用户表
2. 按日期分组统计
3. 生成趋势分析报告
```

#### 2. 国产化数据库迁移

从 PostgreSQL 迁移到 GaussDB：

```
用户: 帮我分析现有表结构，准备迁移到 GaussDB

Claude 会:
1. 获取完整的 Schema 信息
2. 分析表结构、索引、约束
3. 提供迁移建议和兼容性分析
```

#### 3. 性能优化

```
用户: 这个查询很慢，帮我优化

Claude 会:
1. 分析查询语句
2. 检查索引情况
3. 提供优化建议（添加索引、重写查询等）
```

#### 4. 数据分析和报表

```
用户: 生成本月销售报表

Claude 会:
1. 理解需求
2. 生成复杂的聚合查询
3. 返回格式化的分析结果
```

### GaussDB 特色功能

虽然使用 PostgreSQL 协议，但 GaussDB 有一些特色功能：

- **列存储**: 支持列存储表（需要特定语法）
- **分区表**: 增强的分区表功能
- **并行查询**: 更强的并行查询能力
- **AI 能力**: 内置 AI 引擎（部分版本）

**注意**: 这些特色功能可能需要特定的 SQL 语法，Claude 会根据标准 PostgreSQL 语法生成查询。

---

## OceanBase 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "oceanbase-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oceanbase",
        "--host", "localhost",
        "--port", "2881",
        "--user", "root@test",
        "--password", "your_password",
        "--database", "test"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "oceanbase-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oceanbase",
        "--host", "localhost",
        "--port", "2881",
        "--user", "root@test",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接阿里云 OceanBase

```json
{
  "mcpServers": {
    "oceanbase-cloud": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oceanbase",
        "--host", "oceanbase.cn-hangzhou.aliyuncs.com",
        "--port", "2883",
        "--user", "dbuser@tenant",
        "--password", "secure_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行 `SHOW TABLES` 查询
3. 返回表列表

**用户**: 查看 orders 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 执行 `SHOW FULL COLUMNS FROM orders`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个用户的订单数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id ORDER BY order_count DESC`
3. 执行并返回结果

**用户**: 查找最近一天的订单

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY created_at DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**:
   - 直连端口：2881（直接连接 OBServer）
   - 代理端口：2883（通过 OBProxy 连接）
2. **兼容性**: 兼容 MySQL 5.6/5.7 协议和大部分 SQL 语法
3. **驱动**: 使用 MySQL 的 `mysql2` 驱动
4. **用户名格式**: `用户名@租户名`（如 `root@test`、`user@sys`）
5. **租户**: OceanBase 支持多租户，需要指定租户名
6. **分布式**: OceanBase 是分布式数据库，支持水平扩展

### 支持的版本

- ✅ OceanBase 3.x
- ✅ OceanBase 4.x
- ✅ 其他兼容 MySQL 协议的版本

### 常见使用场景

#### 1. 分布式数据库管理

连接 OceanBase 集群进行数据查询和分析：

```
用户: 帮我分析订单表的数据分布

Claude 会:
1. 查询订单表
2. 统计各个维度的数据
3. 生成分析报告
```

#### 2. 从 MySQL 迁移到 OceanBase

```
用户: 帮我分析现有 MySQL 表结构，准备迁移到 OceanBase

Claude 会:
1. 获取完整的 Schema 信息
2. 分析表结构、索引、约束
3. 提供迁移建议和兼容性分析
```

#### 3. 性能优化

```
用户: 这个查询在 OceanBase 上很慢，帮我优化

Claude 会:
1. 分析查询语句
2. 检查索引情况
3. 提供优化建议（考虑分布式特性）
```

#### 4. 多租户管理

```
用户: 查询当前租户的资源使用情况

Claude 会:
1. 生成相应的系统表查询
2. 返回租户资源信息
```

### OceanBase 特色功能

虽然兼容 MySQL 协议，但 OceanBase 有一些特色功能：

- **分布式事务**: 支持跨节点的分布式事务
- **多租户**: 支持多租户隔离
- **高可用**: 自动故障转移和数据恢复
- **弹性扩展**: 支持在线扩容和缩容
- **HTAP**: 同时支持 OLTP 和 OLAP 场景

**注意**: 这些特色功能可能需要特定的 SQL 语法或系统表查询,Claude 会根据标准 MySQL 语法生成查询。

---

## TiDB 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "tidb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "tidb",
        "--host", "localhost",
        "--port", "4000",
        "--user", "root",
        "--password", "",
        "--database", "test"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "tidb-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "tidb",
        "--host", "localhost",
        "--port", "4000",
        "--user", "root",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 TiDB Cloud

```json
{
  "mcpServers": {
    "tidb-cloud": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "tidb",
        "--host", "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
        "--port", "4000",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行 `SHOW TABLES` 查询
3. 返回表列表

**用户**: 查看 employees 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 执行 `SHOW FULL COLUMNS FROM employees`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个部门的员工数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC`
3. 执行并返回结果

**用户**: 查找最近一周入职的员工

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM employees WHERE hire_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY hire_date DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: 4000（TiDB Server 端口）
2. **兼容性**: 兼容 MySQL 5.7 协议和大部分 SQL 语法
3. **驱动**: 使用 MySQL 的 `mysql2` 驱动
4. **分布式**: TiDB 是分布式数据库，支持水平扩展
5. **HTAP**: 同时支持 OLTP 和 OLAP 工作负载
6. **事务**: 支持完整的 ACID 分布式事务

### 支持的版本

- ✅ TiDB 5.x
- ✅ TiDB 6.x
- ✅ TiDB 7.x
- ✅ TiDB 8.x
- ✅ TiDB Cloud

### 常见使用场景

#### 1. 分布式数据库管理

连接 TiDB 集群进行数据查询和分析：

```
用户: 帮我分析用户表的数据分布

Claude 会:
1. 查询用户表
2. 统计各个维度的数据
3. 生成分析报告
```

#### 2. 从 MySQL 迁移到 TiDB

```
用户: 帮我分析现有 MySQL 表结构，准备迁移到 TiDB

Claude 会:
1. 获取完整的 Schema 信息
2. 分析表结构、索引、约束
3. 提供迁移建议和兼容性分析
```

#### 3. 性能优化

```
用户: 这个查询在 TiDB 上很慢，帮我优化

Claude 会:
1. 分析查询语句
2. 检查索引情况
3. 提供优化建议（考虑分布式特性）
```

#### 4. HTAP 场景

```
用户: 对大表进行复杂的聚合分析

Claude 会:
1. 生成适合 OLAP 的查询语句
2. 利用 TiFlash 列式存储加速查询
3. 返回分析结果
```

### TiDB 特色功能

虽然兼容 MySQL 5.7 协议，但 TiDB 有一些特色功能：

- **水平扩展**: 支持在线水平扩展，无需停机
- **分布式事务**: 支持跨节点的 ACID 事务
- **高可用**: 自动故障转移和数据恢复
- **HTAP**: 同时支持 OLTP 和 OLAP 场景
- **TiFlash**: 列式存储引擎，加速 OLAP 查询
- **弹性扩展**: 支持在线扩容和缩容

**注意**: 这些特色功能可能需要特定的 SQL 语法或系统表查询，Claude 会根据标准 MySQL 语法生成查询。

---

## ClickHouse 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "clickhouse-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "clickhouse",
        "--host", "localhost",
        "--port", "8123",
        "--user", "default",
        "--password", "",
        "--database", "default"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "clickhouse-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "clickhouse",
        "--host", "localhost",
        "--port", "8123",
        "--user", "default",
        "--password", "your_password",
        "--database", "analytics",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 ClickHouse Cloud

```json
{
  "mcpServers": {
    "clickhouse-cloud": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "clickhouse",
        "--host", "your-instance.clickhouse.cloud",
        "--port", "8443",
        "--user", "default",
        "--password", "your_password",
        "--database", "default"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 查询 `system.tables` 系统表
3. 返回表列表

**用户**: 查看 events 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 查询 `system.columns` 获取列信息
3. 返回列信息、主键、索引等详细信息

**用户**: 统计最近一小时的事件数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT COUNT(*) as event_count FROM events WHERE timestamp >= now() - INTERVAL 1 HOUR`
3. 执行并返回结果

**用户**: 按用户 ID 分组统计事件数量，取前 10 名

**Claude 会自动**:
1. 生成 SQL: `SELECT user_id, COUNT(*) as event_count FROM events GROUP BY user_id ORDER BY event_count DESC LIMIT 10`
2. 执行并返回结果

### 注意事项

1. **默认端口**:
   - HTTP 端口：8123（推荐用于 MCP 连接）
   - 原生 TCP 端口：9000
   - HTTPS 端口：8443（ClickHouse Cloud）
2. **默认用户**: default
3. **默认数据库**: default
4. **列式存储**: ClickHouse 是列式数据库，适合 OLAP 场景
5. **高性能**: 针对大数据分析优化，查询速度极快
6. **SQL 方言**: 使用自己的 SQL 方言，与标准 SQL 有些差异

### 支持的版本

- ✅ ClickHouse 21.x
- ✅ ClickHouse 22.x
- ✅ ClickHouse 23.x
- ✅ ClickHouse 24.x
- ✅ ClickHouse Cloud

### 常见使用场景

#### 1. 大数据分析

连接 ClickHouse 进行海量数据分析：

```
用户: 分析最近 30 天的用户行为数据

Claude 会:
1. 查询事件表
2. 按时间、用户维度聚合
3. 生成分析报告
```

#### 2. 实时数据查询

```
用户: 查询实时的系统监控指标

Claude 会:
1. 查询最新的监控数据
2. 计算关键指标
3. 返回实时统计结果
```

#### 3. 日志分析

```
用户: 分析应用日志，找出错误最多的接口

Claude 会:
1. 查询日志表
2. 按接口分组统计错误数
3. 返回排序后的结果
```

#### 4. 时序数据分析

```
用户: 分析时序数据的趋势

Claude 会:
1. 按时间窗口聚合数据
2. 计算趋势指标
3. 生成时序分析报告
```

### ClickHouse 特色功能

ClickHouse 作为列式 OLAP 数据库，有许多特色功能：

- **列式存储**: 数据按列存储，压缩率高，查询速度快
- **向量化执行**: 利用 SIMD 指令加速查询
- **分布式查询**: 支持分布式表和分布式查询
- **物化视图**: 支持物化视图加速查询
- **数据压缩**: 多种压缩算法，节省存储空间
- **实时插入**: 支持高并发实时数据插入
- **近似计算**: 支持近似算法加速聚合查询

**注意**: ClickHouse 的 SQL 语法与标准 SQL 有一些差异，Claude 会尽量生成兼容的查询语句。

### ClickHouse 最佳实践

1. **表引擎选择**:
   - 使用 MergeTree 系列引擎（推荐）
   - 根据场景选择合适的表引擎

2. **分区策略**:
   - 按时间分区（如按天、按月）
   - 合理设置分区键

3. **排序键**:
   - 选择查询频繁的列作为排序键
   - 排序键顺序影响查询性能

4. **数据类型**:
   - 使用合适的数据类型节省空间
   - 避免使用 String 类型存储数值

5. **查询优化**:
   - 使用 PREWHERE 过滤数据
   - 避免 SELECT *
   - 合理使用物化视图

---

## PolarDB 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "polardb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "polardb",
        "--host", "pc-xxxxx.mysql.polardb.rds.aliyuncs.com",
        "--port", "3306",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "your_database"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "polardb-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "polardb",
        "--host", "pc-xxxxx.mysql.polardb.rds.aliyuncs.com",
        "--port", "3306",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "your_database",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 PolarDB 集群（读写分离）

```json
{
  "mcpServers": {
    "polardb-primary": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "polardb",
        "--host", "pc-xxxxx.mysql.polardb.rds.aliyuncs.com",
        "--port", "3306",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "your_database",
        "--danger-allow-write"
      ]
    },
    "polardb-readonly": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "polardb",
        "--host", "pc-xxxxx-ro.mysql.polardb.rds.aliyuncs.com",
        "--port", "3306",
        "--user", "readonly_user",
        "--password", "readonly_password",
        "--database", "your_database"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行 `SHOW TABLES` 查询
3. 返回表列表

**用户**: 查看 orders 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 执行 `SHOW FULL COLUMNS FROM orders`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计最近 7 天的订单数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
3. 执行并返回结果

**用户**: 查询销售额最高的 10 个商品

**Claude 会自动**:
1. 生成 SQL: `SELECT product_id, SUM(amount) as total_sales FROM orders GROUP BY product_id ORDER BY total_sales DESC LIMIT 10`
2. 执行并返回结果

### 注意事项

1. **默认端口**: 3306（与 MySQL 相同）
2. **兼容性**: 完全兼容 MySQL 5.6/5.7/8.0 协议
3. **驱动**: 使用 MySQL 的 `mysql2` 驱动
4. **读写分离**:
   - 主地址（Primary Endpoint）：支持读写
   - 集群地址（Cluster Endpoint）：自动读写分离
   - 只读地址（Read-only Endpoint）：只支持读
5. **云原生特性**:
   - 存储与计算分离
   - 秒级弹性扩展
   - 多可用区部署

### 支持的版本

- ✅ PolarDB for MySQL 5.6
- ✅ PolarDB for MySQL 5.7
- ✅ PolarDB for MySQL 8.0
- ✅ PolarDB Serverless

### 常见使用场景

#### 1. 云原生应用数据库

连接 PolarDB 作为云原生应用的主数据库：

```
用户: 查询用户表中的所有活跃用户

Claude 会:
1. 查询用户表
2. 过滤活跃用户
3. 返回结果
```

#### 2. 读写分离场景

```
用户: 使用只读节点查询大量数据进行分析

Claude 会:
1. 连接到只读地址
2. 执行复杂的分析查询
3. 不影响主库性能
```

#### 3. 高并发场景

```
用户: 查询实时订单数据

Claude 会:
1. 利用 PolarDB 的高并发能力
2. 快速返回查询结果
3. 保证数据一致性
```

#### 4. 弹性扩展

```
用户: 在业务高峰期查询数据

Claude 会:
1. PolarDB 自动扩展计算资源
2. 保证查询性能
3. 业务低峰期自动缩容
```

### PolarDB 特色功能

PolarDB 作为云原生数据库，有许多特色功能：

- **存储计算分离**: 存储和计算资源独立扩展
- **一写多读**: 支持一个主节点和多个只读节点
- **秒级弹性**: 计算节点秒级扩展
- **全局一致性**: 分布式事务保证数据一致性
- **并行查询**: 支持并行查询加速
- **热备份**: 在线备份不影响业务
- **多可用区**: 支持多可用区部署，高可用

**注意**: 这些特色功能在标准 MySQL 协议下可能需要特定的配置或 SQL 语法。

### PolarDB 最佳实践

1. **读写分离**:
   - 写操作使用主地址
   - 读操作使用只读地址或集群地址
   - 分析查询使用只读节点

2. **连接池管理**:
   - 合理设置连接池大小
   - 使用长连接减少连接开销
   - 定期检查连接健康状态

3. **查询优化**:
   - 使用合适的索引
   - 避免全表扫描
   - 合理使用 LIMIT
   - 利用查询缓存

4. **监控告警**:
   - 监控 CPU、内存、IOPS
   - 设置慢查询告警
   - 关注连接数使用情况
   - 定期查看性能洞察

5. **安全建议**:
   - 使用 SSL 连接
   - 设置白名单
   - 定期更换密码
   - 使用 RAM 账号管理权限

---

## Vastbase 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "vastbase-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "vastbase",
        "--host", "localhost",
        "--port", "5432",
        "--user", "vastbase",
        "--password", "your_password",
        "--database", "postgres"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "vastbase-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "vastbase",
        "--host", "localhost",
        "--port", "5432",
        "--user", "vastbase",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 Vastbase 集群

```json
{
  "mcpServers": {
    "vastbase-cluster": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "vastbase",
        "--host", "vastbase-cluster.example.com",
        "--port", "5432",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 查询 `information_schema.tables`
3. 返回表列表

**用户**: 查看 employees 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 查询 `information_schema.columns`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个部门的员工数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT department, COUNT(*) as employee_count FROM employees GROUP BY department ORDER BY employee_count DESC`
3. 执行并返回结果

**用户**: 查找最近一周入职的员工

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM employees WHERE hire_date >= CURRENT_DATE - INTERVAL '7 days' ORDER BY hire_date DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: 5432（与 PostgreSQL 相同）
2. **兼容性**: 兼容 PostgreSQL 协议和大部分 SQL 语法
3. **驱动**: 使用 PostgreSQL 的 `pg` 驱动
4. **国产数据库**: 海量数据公司开发，支持国产化替代
5. **企业级特性**:
   - 支持分布式架构
   - 支持高可用集群
   - 支持数据加密
   - 支持审计日志

### 支持的版本

- ✅ Vastbase G100 V2.2
- ✅ Vastbase G100 V2.3
- ✅ 其他兼容 PostgreSQL 的版本

### 常见使用场景

#### 1. 国产化替代

使用 Vastbase 替代 PostgreSQL 或 Oracle：

```
用户: 查询用户表中的所有数据

Claude 会:
1. 查询用户表
2. 返回结果
3. 完全兼容 PostgreSQL 语法
```

#### 2. 企业级应用

```
用户: 查询订单表，需要关联多个表

Claude 会:
1. 生成复杂的 JOIN 查询
2. 利用 Vastbase 的查询优化
3. 返回结果
```

#### 3. 数据分析

```
用户: 分析最近一个月的销售趋势

Claude 会:
1. 生成聚合查询
2. 按日期分组统计
3. 生成趋势分析报告
```

#### 4. 高可用场景

```
用户: 连接 Vastbase 集群进行查询

Claude 会:
1. 连接到集群地址
2. 自动负载均衡
3. 保证高可用性
```

### Vastbase 特色功能

Vastbase 作为国产数据库，有一些特色功能：

- **PostgreSQL 兼容**: 兼容 PostgreSQL 协议和语法
- **分布式架构**: 支持分布式部署和查询
- **高可用**: 支持主备切换和故障转移
- **数据加密**: 支持透明数据加密（TDE）
- **审计日志**: 完善的审计日志功能
- **国产化**: 支持国产操作系统和芯片

**注意**: 这些特色功能可能需要特定的配置或 SQL 语法，Claude 会根据标准 PostgreSQL 语法生成查询。

### Vastbase 最佳实践

1. **表设计**:
   - 使用合适的数据类型
   - 合理设计主键和索引
   - 使用分区表提升性能
   - 避免过度规范化

2. **查询优化**:
   - 使用 EXPLAIN 分析查询计划
   - 创建合适的索引
   - 避免 SELECT *
   - 使用 LIMIT 限制返回结果

3. **连接管理**:
   - 使用连接池
   - 合理设置连接数
   - 定期检查连接健康状态
   - 避免长时间持有连接

4. **监控维护**:
   - 监控数据库性能指标
   - 定期执行 VACUUM
   - 更新统计信息
   - 定期备份数据

5. **安全建议**:
   - 使用强密码
   - 限制网络访问
   - 启用 SSL 连接
   - 定期审计日志

---

## HighGo 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "highgo-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "highgo",
        "--host", "localhost",
        "--port", "5866",
        "--user", "highgo",
        "--password", "your_password",
        "--database", "highgo"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "highgo-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "highgo",
        "--host", "localhost",
        "--port", "5866",
        "--user", "highgo",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 HighGo 集群

```json
{
  "mcpServers": {
    "highgo-cluster": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "highgo",
        "--host", "highgo-cluster.example.com",
        "--port", "5866",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 查询 `information_schema.tables`
3. 返回表列表

**用户**: 查看 products 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 查询 `information_schema.columns`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个类别的商品数量

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY product_count DESC`
3. 执行并返回结果

**用户**: 查找价格超过 1000 元的商品

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM products WHERE price > 1000 ORDER BY price DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: 5866（HighGo 默认端口）
2. **兼容性**: 兼容 PostgreSQL 协议和大部分 SQL 语法
3. **驱动**: 使用 PostgreSQL 的 `pg` 驱动
4. **国产数据库**: 瀚高公司开发，支持国产化替代
5. **企业级特性**:
   - 支持高可用集群
   - 支持数据加密
   - 支持审计日志
   - 支持备份恢复

### 支持的版本

- ✅ HighGo DB 4.x
- ✅ HighGo DB 5.x
- ✅ HighGo DB 6.x
- ✅ 其他兼容 PostgreSQL 的版本

### 常见使用场景

#### 1. 国产化替代

使用 HighGo 替代 PostgreSQL 或 Oracle：

```
用户: 查询订单表中的所有数据

Claude 会:
1. 查询订单表
2. 返回结果
3. 完全兼容 PostgreSQL 语法
```

#### 2. 企业级应用

```
用户: 查询销售数据，需要关联多个表

Claude 会:
1. 生成复杂的 JOIN 查询
2. 利用 HighGo 的查询优化
3. 返回结果
```

#### 3. 数据分析

```
用户: 分析最近一季度的销售趋势

Claude 会:
1. 生成聚合查询
2. 按时间分组统计
3. 生成趋势分析报告
```

#### 4. 高可用场景

```
用户: 连接 HighGo 集群进行查询

Claude 会:
1. 连接到集群地址
2. 自动负载均衡
3. 保证高可用性
```

### HighGo 特色功能

HighGo 作为国产数据库，有一些特色功能：

- **PostgreSQL 兼容**: 兼容 PostgreSQL 9.x/10.x/11.x 协议和语法
- **高可用**: 支持主备切换和故障转移
- **数据加密**: 支持透明数据加密（TDE）
- **审计日志**: 完善的审计日志功能
- **国产化**: 支持国产操作系统和芯片
- **Oracle 兼容**: 部分版本支持 Oracle 兼容模式

**注意**: 这些特色功能可能需要特定的配置或 SQL 语法，Claude 会根据标准 PostgreSQL 语法生成查询。

### HighGo 最佳实践

1. **表设计**:
   - 使用合适的数据类型
   - 合理设计主键和索引
   - 使用分区表提升性能
   - 避免过度规范化

2. **查询优化**:
   - 使用 EXPLAIN 分析查询计划
   - 创建合适的索引
   - 避免 SELECT *
   - 使用 LIMIT 限制返回结果

3. **连接管理**:
   - 使用连接池
   - 合理设置连接数
   - 定期检查连接健康状态
   - 避免长时间持有连接

4. **监控维护**:
   - 监控数据库性能指标
   - 定期执行 VACUUM
   - 更新统计信息
   - 定期备份数据

5. **安全建议**:
   - 使用强密码
   - 限制网络访问
   - 启用 SSL 连接
   - 定期审计日志

---

## GoldenDB 使用示例

### 基础配置（只读模式）

```json
{
  "mcpServers": {
    "goldendb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "goldendb",
        "--host", "localhost",
        "--port", "3306",
        "--user", "root",
        "--password", "your_password",
        "--database", "test"
      ]
    }
  }
}
```

### 启用写入模式

```json
{
  "mcpServers": {
    "goldendb-write": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "goldendb",
        "--host", "localhost",
        "--port", "3306",
        "--user", "root",
        "--password", "your_password",
        "--database", "mydb",
        "--danger-allow-write"
      ]
    }
  }
}
```

### 连接 GoldenDB 分布式集群

```json
{
  "mcpServers": {
    "goldendb-cluster": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "goldendb",
        "--host", "goldendb-cluster.example.com",
        "--port", "3306",
        "--user", "your_username",
        "--password", "your_password",
        "--database", "production"
      ]
    }
  }
}
```

### 与 Claude 对话示例

**用户**: 查看数据库中有哪些表？

**Claude 会自动**:
1. 调用 `get_schema` 工具
2. 执行 `SHOW TABLES` 查询
3. 返回表列表

**用户**: 查看 transactions 表的结构

**Claude 会自动**:
1. 调用 `get_table_info` 工具
2. 执行 `SHOW FULL COLUMNS FROM transactions`
3. 返回列信息、主键、索引等详细信息

**用户**: 统计每个用户的交易总额

**Claude 会自动**:
1. 理解需求
2. 生成 SQL: `SELECT user_id, SUM(amount) as total_amount FROM transactions GROUP BY user_id ORDER BY total_amount DESC`
3. 执行并返回结果

**用户**: 查找最近 24 小时的大额交易（金额超过 10000）

**Claude 会自动**:
1. 生成 SQL: `SELECT * FROM transactions WHERE amount > 10000 AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY amount DESC`
2. 执行并返回结果

### 注意事项

1. **默认端口**: 3306（与 MySQL 相同）
2. **兼容性**: 完全兼容 MySQL 5.7/8.0 协议
3. **驱动**: 使用 MySQL 的 `mysql2` 驱动
4. **国产数据库**: 中兴通讯开发，支持国产化替代
5. **分布式特性**:
   - 支持分布式事务
   - 支持水平扩展
   - 支持高可用集群
   - 支持读写分离

### 支持的版本

- ✅ GoldenDB 2.x
- ✅ GoldenDB 3.x
- ✅ 其他兼容 MySQL 的版本

### 常见使用场景

#### 1. 电信行业应用

GoldenDB 在电信行业有广泛应用：

```
用户: 查询用户通话记录

Claude 会:
1. 查询通话记录表
2. 按用户分组统计
3. 返回分析结果
```

#### 2. 金融交易系统

```
用户: 查询今日交易流水

Claude 会:
1. 查询交易表
2. 过滤今日数据
3. 返回交易明细
```

#### 3. 分布式场景

```
用户: 查询分布式表的数据

Claude 会:
1. 连接到 GoldenDB 集群
2. 执行分布式查询
3. 自动聚合结果
```

#### 4. 高并发场景

```
用户: 查询实时订单数据

Claude 会:
1. 利用 GoldenDB 的高并发能力
2. 快速返回查询结果
3. 保证数据一致性
```

### GoldenDB 特色功能

GoldenDB 作为国产分布式数据库，有一些特色功能：

- **MySQL 兼容**: 完全兼容 MySQL 5.7/8.0 协议和语法
- **分布式架构**: 支持分布式事务和水平扩展
- **高可用**: 支持主备切换和故障转移
- **读写分离**: 支持读写分离架构
- **弹性扩展**: 支持在线扩容和缩容
- **国产化**: 支持国产操作系统和芯片
- **电信级**: 满足电信级可靠性要求

**注意**: 这些特色功能可能需要特定的配置或 SQL 语法，Claude 会根据标准 MySQL 语法生成查询。

### GoldenDB 最佳实践

1. **表设计**:
   - 使用合适的分片键
   - 合理设计主键和索引
   - 考虑数据分布均衡
   - 避免跨分片查询

2. **查询优化**:
   - 使用 EXPLAIN 分析查询计划
   - 创建合适的索引
   - 避免 SELECT *
   - 使用 LIMIT 限制返回结果

3. **分布式事务**:
   - 合理使用分布式事务
   - 避免长事务
   - 注意事务隔离级别
   - 处理分布式死锁

4. **监控维护**:
   - 监控集群状态
   - 关注分片数据分布
   - 定期检查慢查询
   - 定期备份数据

5. **安全建议**:
   - 使用强密码
   - 限制网络访问
   - 启用 SSL 连接
   - 定期审计日志

---

## Claude Desktop 配置示例

### 同时连接多个数据库

你可以在 Claude Desktop 中同时配置多个数据库连接：

```json
{
  "mcpServers": {
    "mysql-prod": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mysql",
        "--host", "prod-db.example.com",
        "--port", "3306",
        "--user", "readonly",
        "--password", "prod_password",
        "--database", "production"
      ]
    },
    "postgres-analytics": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "postgres",
        "--host", "analytics.example.com",
        "--port", "5432",
        "--user", "analyst",
        "--password", "analytics_password",
        "--database", "warehouse"
      ]
    },
    "redis-cache": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "redis",
        "--host", "cache.example.com",
        "--port", "6379",
        "--password", "cache_password"
      ]
    },
    "oracle-warehouse": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "oracle",
        "--host", "oracle.example.com",
        "--port", "1521",
        "--user", "warehouse_user",
        "--password", "warehouse_password",
        "--database", "DWH"
      ]
    },
    "sqlite-local": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "sqlite",
        "--file", "/Users/yourname/data/local.db"
      ]
    },
    "kingbase-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "kingbase",
        "--host", "localhost",
        "--port", "54321",
        "--user", "system",
        "--password", "your_password",
        "--database", "test"
      ]
    },
    "gaussdb-db": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "gaussdb",
        "--host", "localhost",
        "--port", "5432",
        "--user", "gaussdb",
        "--password", "your_password",
        "--database", "postgres"
      ]
    }
  }
}
```

重启 Claude Desktop 后，你可以在对话中指定使用哪个数据库：

- "在 MySQL 生产库中查询..."
- "从 PostgreSQL 分析库获取..."
- "检查 Redis 缓存中的..."
- "在 Oracle 数据仓库中统计..."
- "从 SQLite 本地数据库查询..."
- "在 KingbaseES 数据库中查询..."
- "从 GaussDB 数据库获取..."
- "在 OceanBase 集群中查询..."

---

## 常见使用场景

### 1. 数据分析

**场景**: 快速分析业务数据

```
用户: 帮我分析最近一个月的销售趋势

Claude 会:
1. 查看 orders 表结构
2. 按日期分组统计订单金额
3. 生成趋势分析报告
```

### 2. 问题排查

**场景**: 排查生产问题

```
用户: 为什么用户 ID 12345 无法登录？

Claude 会:
1. 查询 users 表找到该用户
2. 检查 login_logs 表的最近记录
3. 分析可能的原因（账号状态、密码错误次数等）
```

### 3. 数据迁移准备

**场景**: 了解数据库结构以准备迁移

```
用户: 帮我生成所有表的结构文档

Claude 会:
1. 调用 get_schema 获取完整结构
2. 整理成 Markdown 格式的文档
3. 包含表名、列定义、索引、外键等信息
```

### 4. 性能优化建议

**场景**: 优化慢查询

```
用户: 这个查询很慢，帮我优化：SELECT * FROM orders WHERE user_id = 123

Claude 会:
1. 查看 orders 表的索引情况
2. 建议添加索引或修改查询
3. 解释优化原理
```

### 5. Redis 缓存管理

**场景**: 管理缓存数据

```
用户: 清理所有过期的会话缓存

Claude 会:
1. 查找所有 session: 开头的键
2. 检查 TTL
3. 在写入模式下执行清理（需要 --danger-allow-write）
```

---

## 安全提示

### ✅ 推荐做法

1. **生产环境只读**: 生产数据库永远不要启用 `--danger-allow-write`
2. **使用专用账号**: 为 MCP 创建权限受限的数据库账号
3. **网络隔离**: 通过 VPN 或跳板机访问生产数据库
4. **审计日志**: 定期检查 Claude Desktop 的操作日志

### ❌ 避免做法

1. 不要在生产环境启用写入模式
2. 不要使用 root 或 admin 账号
3. 不要在公共网络直接连接数据库
4. 不要在配置文件中明文存储密码（考虑使用环境变量）

---

## 故障排查

### 连接失败

**错误**: `数据库连接失败`

**解决方案**:
1. 检查数据库服务是否运行
2. 验证主机地址和端口
3. 确认用户名和密码正确
4. 检查防火墙规则

### 权限不足

**错误**: `Access denied` 或 `permission denied`

**解决方案**:
1. 确认数据库用户有足够权限
2. MySQL: `GRANT SELECT ON database.* TO 'user'@'host';`
3. PostgreSQL: `GRANT SELECT ON ALL TABLES IN SCHEMA public TO user;`

### 写操作被拒绝

**错误**: `操作被拒绝：当前处于只读安全模式`

**解决方案**:
- 这是安全特性，如需写入，添加 `--danger-allow-write` 参数
- 仅在开发环境使用！

---

## 更多帮助

- 查看 [README.md](./README.md) 了解项目概述
- 查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解如何贡献
- 提交 Issue: https://github.com/yourusername/universal-db-mcp/issues

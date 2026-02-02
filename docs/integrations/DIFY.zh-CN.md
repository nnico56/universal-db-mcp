# Dify 集成指南

本指南展示如何将 Universal Database MCP Server 与 Dify AI 应用开发平台集成。

## 概述

Dify 是一个 LLM 应用开发平台。通过集成 Universal Database MCP Server，您可以让 Dify 应用查询和分析数据库数据。

**两种集成方式：**
1. **MCP 协议（推荐）** - 使用 Dify 原生 MCP 工具支持，通过 SSE/Streamable HTTP 连接
2. **自定义 API 工具** - 使用 HTTP REST API 作为自定义工具

## 前置要求

- 部署了 HTTP 模式的 Universal Database MCP Server
- Dify 账号（自托管或云端）
- 数据库实例（MySQL、PostgreSQL 等）

---

## 方式一：MCP 协议集成（推荐）

此方式使用 Dify 原生的 MCP 工具支持，提供更无缝的集成体验。

### 步骤 1: 部署 HTTP 服务器

以 HTTP 模式部署 Universal Database MCP Server：

```bash
# 使用 npm
export MODE=http
export HTTP_PORT=3000
export API_KEYS=your-secret-key  # 可选：启用 API Key 认证
npx universal-db-mcp

# 或使用 Docker
docker run -d \
  --name universal-db-mcp \
  -p 3000:3000 \
  -e MODE=http \
  -e HTTP_PORT=3000 \
  -e API_KEYS=your-secret-key \
  universal-db-mcp:latest
```

> **注意**: 如果配置了 `API_KEYS`，所有 MCP 端点都需要通过 `X-API-Key` 请求头或 `Authorization: Bearer <key>` 进行认证。

### 步骤 2: 在 Dify 中配置 MCP 工具

1. 登录 [Dify](https://dify.ai/)
2. 进入 **工具** > **MCP 工具**
3. 点击 **添加 MCP 服务器**
4. 使用以下方式之一配置 MCP 服务器：

#### 选项 A：SSE 端点（传统方式）

**服务器名称**: `Universal DB MCP`

**服务器 URL**:
```
http://your-server:3000/sse?type=mysql&host=db-host&port=3306&user=root&password=your_password&database=your_database
```

**请求头**（如果配置了 API_KEYS）:
```
X-API-Key: your-secret-key
```

数据库配置通过 URL 参数传递。

#### 选项 B：Streamable HTTP 端点（推荐）

**服务器名称**: `Universal DB MCP`

**服务器 URL**:
```
http://your-server:3000/mcp
```

**请求头**:
```
X-API-Key: your-secret-key
X-DB-Type: mysql
X-DB-Host: db-host
X-DB-Port: 3306
X-DB-User: root
X-DB-Password: your_password
X-DB-Database: your_database
```

数据库配置通过 HTTP 请求头传递。

### 可用端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/sse` | GET | 建立 SSE 连接（传统方式） |
| `/sse/message` | POST | 向 SSE 会话发送消息 |
| `/mcp` | POST | Streamable HTTP 端点（推荐） |
| `/mcp` | GET | Streamable HTTP 的 SSE 流 |
| `/mcp` | DELETE | 关闭会话 |

### 步骤 3: 在应用中使用 MCP 工具

配置完成后，以下 MCP 工具将在您的 Dify 应用中可用：

| 工具 | 描述 |
|------|------|
| `execute_query` | 执行 SQL 查询 |
| `get_schema` | 获取数据库结构信息 |
| `get_table_info` | 获取表详细信息 |
| `clear_cache` | 清除 Schema 缓存 |

### MCP SSE URL 参数

| 参数 | 必填 | 描述 |
|------|------|------|
| `type` | 是 | 数据库类型：mysql、postgres、redis、oracle、dm、sqlserver、mongodb、sqlite、kingbase、gaussdb、oceanbase、tidb、clickhouse、polardb、vastbase、highgo、goldendb |
| `host` | 是* | 数据库主机 |
| `port` | 否 | 数据库端口（不指定则使用默认端口） |
| `user` | 是* | 数据库用户名 |
| `password` | 是* | 数据库密码 |
| `database` | 是* | 数据库名称 |
| `filePath` | 是* | SQLite 文件路径（仅 sqlite 类型） |
| `allowWrite` | 否 | 启用写操作（默认：false） |

*必填字段取决于数据库类型

### SSE URL 示例

**MySQL:**
```
http://localhost:3000/sse?type=mysql&host=localhost&port=3306&user=root&password=secret&database=myapp
```

**PostgreSQL:**
```
http://localhost:3000/sse?type=postgres&host=localhost&port=5432&user=postgres&password=secret&database=myapp
```

**SQLite:**
```
http://localhost:3000/sse?type=sqlite&filePath=/path/to/database.db
```

**Redis:**
```
http://localhost:3000/sse?type=redis&host=localhost&port=6379&password=secret
```

**达梦数据库:**
```
http://localhost:3000/sse?type=dm&host=localhost&port=5236&user=SYSDBA&password=secret&database=DAMENG
```

**人大金仓:**
```
http://localhost:3000/sse?type=kingbase&host=localhost&port=54321&user=system&password=secret&database=mydb
```

### Streamable HTTP 请求头参数

| 请求头 | 必填 | 描述 |
|--------|------|------|
| `X-DB-Type` | 是 | 数据库类型：mysql、postgres、redis、oracle、dm、sqlserver、mongodb、sqlite、kingbase、gaussdb、oceanbase、tidb、clickhouse、polardb、vastbase、highgo、goldendb |
| `X-DB-Host` | 是* | 数据库主机 |
| `X-DB-Port` | 否 | 数据库端口（不指定则使用默认端口） |
| `X-DB-User` | 是* | 数据库用户名 |
| `X-DB-Password` | 是* | 数据库密码 |
| `X-DB-Database` | 是* | 数据库名称 |
| `X-DB-FilePath` | 是* | SQLite 文件路径（仅 sqlite 类型） |
| `X-DB-Allow-Write` | 否 | 启用写操作（默认：false） |
| `X-DB-Oracle-Client-Path` | 否 | Oracle Instant Client 路径（用于 Oracle 11g） |
| `mcp-session-id` | 否 | 后续请求的会话 ID |

*必填字段取决于数据库类型

### Streamable HTTP 请求示例

**初始化连接（MySQL）：**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "X-DB-Type: mysql" \
  -H "X-DB-Host: localhost" \
  -H "X-DB-Port: 3306" \
  -H "X-DB-User: root" \
  -H "X-DB-Password: secret" \
  -H "X-DB-Database: myapp" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}},"id":1}'
```

**后续请求（带会话 ID）：**
```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: your-session-id" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":2}'
```

---

## 方式二：自定义 API 工具集成

此方式使用 Dify 的自定义 API 工具功能，通过 REST API 端点集成。

### 步骤 1: 部署 HTTP API 服务器

部署 Universal Database MCP Server：

```bash
docker run -d \
  --name universal-db-mcp \
  -p 3000:3000 \
  -e MODE=http \
  -e HTTP_PORT=3000 \
  -e API_KEYS=dify-secret-key \
  -e CORS_ORIGINS=* \
  universal-db-mcp:latest
```

### 步骤 2: 创建 Dify 应用

1. 登录 [Dify](https://dify.ai/)
2. 点击"创建应用"
3. 选择应用类型：
   - **聊天助手**: 用于对话式数据库查询
   - **Agent**: 用于自主数据库操作
   - **工作流**: 用于结构化数据库工作流
4. 命名您的应用（例如："数据库助手"）

### 步骤 3: 添加 API 工具

1. 在应用编辑器中，转到"工具"部分
2. 点击"添加工具"
3. 选择"自定义 API"
4. 配置 API 工具

### 步骤 4: 配置 API 工具

#### 基本信息

**工具名称**: `数据库查询工具`
**描述**: `查询和分析数据库数据`
**图标**: 选择数据库图标

#### 认证

**类型**: `API Key`
**请求头名称**: `X-API-Key`
**API Key**: `dify-secret-key`

#### API 端点

添加以下端点：

##### 端点 1: 连接数据库

**名称**: `connect_database`
**方法**: `POST`
**URL**: `https://your-api-url/api/connect`
**描述**: 连接到数据库

**请求 Schema**:
```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "description": "数据库类型（mysql、postgres、redis 等）",
      "enum": ["mysql", "postgres", "redis", "mongodb", "sqlite"]
    },
    "host": {
      "type": "string",
      "description": "数据库主机"
    },
    "port": {
      "type": "integer",
      "description": "数据库端口"
    },
    "user": {
      "type": "string",
      "description": "用户名"
    },
    "password": {
      "type": "string",
      "description": "密码"
    },
    "database": {
      "type": "string",
      "description": "数据库名称"
    }
  },
  "required": ["type", "host", "port"]
}
```

**响应 Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "sessionId": {"type": "string"},
        "databaseType": {"type": "string"},
        "connected": {"type": "boolean"}
      }
    }
  }
}
```

##### 端点 2: 执行查询

**名称**: `execute_query`
**方法**: `POST`
**URL**: `https://your-api-url/api/query`
**描述**: 执行 SQL 查询

**请求 Schema**:
```json
{
  "type": "object",
  "properties": {
    "sessionId": {
      "type": "string",
      "description": "从 connect_database 获取的会话 ID"
    },
    "query": {
      "type": "string",
      "description": "要执行的 SQL 查询"
    },
    "params": {
      "type": "array",
      "description": "查询参数（可选）"
    }
  },
  "required": ["sessionId", "query"]
}
```

**响应 Schema**:
```json
{
  "type": "object",
  "properties": {
    "success": {"type": "boolean"},
    "data": {
      "type": "object",
      "properties": {
        "rows": {"type": "array"},
        "executionTime": {"type": "number"}
      }
    }
  }
}
```

##### 端点 3: 列出表

**名称**: `list_tables`
**方法**: `GET`
**URL**: `https://your-api-url/api/tables`
**描述**: 列出所有表

**查询参数**:
```json
{
  "sessionId": {
    "type": "string",
    "required": true,
    "description": "会话 ID"
  }
}
```

##### 端点 4: 获取表结构

**名称**: `get_table_schema`
**方法**: `GET`
**URL**: `https://your-api-url/api/schema/{table}`
**描述**: 获取表结构

**路径参数**:
```json
{
  "table": {
    "type": "string",
    "required": true,
    "description": "表名"
  }
}
```

**查询参数**:
```json
{
  "sessionId": {
    "type": "string",
    "required": true,
    "description": "会话 ID"
  }
}
```

### 步骤 5: 配置应用提示词

#### 聊天助手应用

**系统提示词**:
```
你是一个数据库助手，帮助用户查询和分析数据库数据。

可用工具：
- connect_database: 连接到数据库
- execute_query: 执行 SQL 查询
- list_tables: 列出数据库中的所有表
- get_table_schema: 获取表结构

工作流程：
1. 当用户想要查询数据时，首先检查是否已连接到数据库
2. 如果未连接，询问数据库凭据并使用 connect_database
3. 使用 list_tables 查看可用表
4. 使用 get_table_schema 了解表结构
5. 根据用户问题生成适当的 SQL 查询
6. 使用 execute_query 运行查询
7. 以清晰、可读的方式格式化并呈现结果

指南：
- 执行前始终验证 SQL 查询
- 尽可能使用参数化查询
- 限制结果集以防止输出过多
- 向用户解释查询逻辑
- 优雅地处理错误
```

**开场白**:
```
您好！我是您的数据库助手。我可以帮助您使用自然语言查询和分析数据库数据。

要开始，请提供您的数据库连接详情：
- 数据库类型（MySQL、PostgreSQL 等）
- 主机和端口
- 用户名和密码
- 数据库名称

或者您可以问我这样的问题：
- "显示所有用户"
- "上个月下了多少订单？"
- "平均订单价值是多少？"
```

#### Agent 应用

**Agent 指令**:
```
你是一个自主数据库 Agent，可以：
1. 连接到数据库
2. 探索数据库结构
3. 执行查询
4. 分析数据
5. 生成报告

可用工具：
- connect_database
- execute_query
- list_tables
- get_table_schema

当给定任务时：
1. 将其分解为步骤
2. 使用工具收集信息
3. 根据需要执行查询
4. 综合结果
5. 清晰地呈现发现
```

#### 工作流应用

创建包含以下节点的工作流：

1. **开始节点**: 接收用户输入
2. **LLM 节点**: 分析用户请求
3. **工具节点**: 连接到数据库
4. **工具节点**: 列出表
5. **工具节点**: 获取表结构
6. **LLM 节点**: 生成 SQL 查询
7. **工具节点**: 执行查询
8. **LLM 节点**: 格式化结果
9. **结束节点**: 返回响应

### 步骤 6: 测试应用

使用示例查询测试：

**示例 1: 简单查询**
```
用户：显示所有用户
助手：让我为您查询数据库。
[调用 list_tables]
[调用 get_table_schema 获取"users"]
[生成 SQL: SELECT * FROM users LIMIT 10]
[调用 execute_query]
助手：这是用户列表：
1. Alice (alice@example.com)
2. Bob (bob@example.com)
...
```

**示例 2: 聚合**
```
用户：上个月下了多少订单？
助手：我来为您检查订单。
[分析结构]
[生成 SQL: SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)]
[执行查询]
助手：上个月下了 1,234 个订单。
```

**示例 3: 复杂分析**
```
用户：按产品类别的收入是多少？
助手：让我分析收入数据。
[连接订单和产品表]
[按类别分组]
[计算总和]
助手：按类别的收入：
- 电子产品: ¥45,230
- 服装: ¥32,100
- 图书: ¥18,450
```

## 高级功能

### 变量管理

在 Dify 变量中存储会话 ID：

```python
# 在工作流中
session_id = connect_database(params)
set_variable("db_session_id", session_id)

# 稍后使用
session_id = get_variable("db_session_id")
execute_query(session_id, query)
```

### 上下文记忆

使用 Dify 的记忆功能记住数据库连接：

```python
# 存储在对话记忆中
memory.set("database_type", "mysql")
memory.set("session_id", session_id)

# 稍后检索
session_id = memory.get("session_id")
```

### 查询模板

创建可重用的查询模板：

```sql
-- 模板：按邮箱获取用户
SELECT * FROM users WHERE email = ?

-- 模板：按日期范围获取订单
SELECT * FROM orders
WHERE created_at BETWEEN ? AND ?
ORDER BY created_at DESC

-- 模板：按期间的收入
SELECT
  DATE_FORMAT(created_at, '%Y-%m') as month,
  SUM(total_amount) as revenue
FROM orders
WHERE created_at >= ?
GROUP BY month
ORDER BY month DESC
```

### 数据可视化

与 Dify 的可视化功能集成：

```python
# 查询数据
results = execute_query(session_id, query)

# 格式化为图表
chart_data = {
  "type": "bar",
  "data": {
    "labels": [row["month"] for row in results],
    "datasets": [{
      "label": "收入",
      "data": [row["revenue"] for row in results]
    }]
  }
}

return chart_data
```

## 用例

### 用例 1: 客户服务机器人

**场景**: 客服人员查询客户数据

**功能**:
- 查找客户信息
- 检查订单状态
- 查看购买历史
- 更新客户备注

**示例查询**:
```
- "查找邮箱为 alice@example.com 的客户"
- "显示客户 ID 123 的订单"
- "订单 #456 的状态是什么？"
```

### 用例 2: 商业智能 Agent

**场景**: 高管获取业务洞察

**功能**:
- 收入分析
- 客户指标
- 产品性能
- 趋势分析

**示例查询**:
```
- "本季度的收入是多少？"
- "显示按收入排名前 10 的客户"
- "哪些产品卖得最好？"
- "客户留存率是多少？"
```

### 用例 3: 数据导出工作流

**场景**: 自动化数据导出和报告

**工作流**:
1. 定时触发（每天）
2. 连接到数据库
3. 执行导出查询
4. 格式化为 CSV/Excel
5. 通过邮件/Slack 发送
6. 断开连接

### 用例 4: 数据库监控

**场景**: 监控数据库健康和性能

**功能**:
- 表大小监控
- 查询性能跟踪
- 异常告警
- 自动化报告

## 最佳实践

### 1. 安全性

- 使用只读数据库用户
- 在 Dify 密钥中安全存储凭据
- 验证所有 SQL 查询
- 实现查询白名单

### 2. 性能

- 为查询添加 LIMIT
- 在频繁查询的列上使用索引
- 为 Schema 信息实现缓存
- 监控查询执行时间

### 3. 错误处理

- 捕获并处理数据库错误
- 提供用户友好的错误消息
- 实现重试逻辑
- 记录错误以供调试

### 4. 用户体验

- 提供清晰的说明
- 显示查询进度
- 格式化结果美观
- 提供查询建议

## 集成模式

### 模式 1: RAG 与数据库

结合数据库查询与 RAG：

```python
# 1. 查询数据库获取结构化数据
db_results = execute_query(session_id, query)

# 2. 使用 RAG 获取非结构化数据
rag_results = search_knowledge_base(question)

# 3. 合并结果
combined = merge_results(db_results, rag_results)

# 4. 生成响应
response = llm.generate(combined)
```

### 模式 2: 多数据库查询

查询多个数据库：

```python
# 连接到多个数据库
mysql_session = connect_database(mysql_config)
postgres_session = connect_database(postgres_config)

# 查询每个数据库
mysql_data = execute_query(mysql_session, mysql_query)
postgres_data = execute_query(postgres_session, postgres_query)

# 合并结果
merged = merge_data(mysql_data, postgres_data)
```

### 模式 3: 流式结果

流式传输大结果集：

```python
# 使用分页执行查询
offset = 0
batch_size = 100

while True:
    query = f"SELECT * FROM users LIMIT {batch_size} OFFSET {offset}"
    results = execute_query(session_id, query)

    if not results:
        break

    # 处理批次
    process_batch(results)

    offset += batch_size
```

## 故障排除

### 问题：连接失败

**症状**：无法连接到数据库

**解决方案**：
1. 验证数据库凭据
2. 检查网络连接
3. 确保 API 服务器可访问
4. 检查防火墙规则

### 问题：查询超时

**症状**：查询耗时过长

**解决方案**：
1. 为表添加索引
2. 优化 SQL 查询
3. 增加超时设置
4. 使用分页

### 问题：内存错误

**症状**：内存不足错误

**解决方案**：
1. 限制结果集大小
2. 对大数据集使用流式传输
3. 实现分页
4. 增加内存分配

## 资源

- [Dify 文档](https://docs.dify.ai/)
- [API 参考](../http-api/API_REFERENCE.zh-CN.md)
- [部署指南](../http-api/DEPLOYMENT.zh-CN.md)

## 支持

如有集成问题：
- GitHub Issues: https://github.com/Anarkh-Lee/universal-db-mcp/issues
- Dify 社区: https://discord.gg/dify

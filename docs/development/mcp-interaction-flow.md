# AI - MCP - 用户 交互流程详解

本文档详细说明 AI、MCP Server 和用户之间的完整交互流程。

## 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              用户界面层                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Claude Desktop / Cherry Studio / 其他 MCP 客户端                    │   │
│  │  用户输入: "帮我查看 users 表有多少条数据"                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1. 用户消息
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI 模型层                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Claude / 其他 LLM                                                   │   │
│  │  - 理解用户意图                                                       │   │
│  │  - 决定调用哪个 Tool                                                  │   │
│  │  - 生成 Tool 调用参数（如 SQL）                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 2. Tool 调用请求 (JSON-RPC over stdio)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MCP Server 层                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Universal DB MCP (本项目)                                           │   │
│  │  - 接收 Tool 调用                                                     │   │
│  │  - 执行数据库操作                                                     │   │
│  │  - 返回结果                                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 3. 数据库查询
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              数据库层                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  MySQL / PostgreSQL / Oracle / ...                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 详细流程

### 第一阶段：启动与初始化

```
1. 用户启动 Claude Desktop
       │
       ▼
2. Claude Desktop 读取配置文件 (claude_desktop_config.json)
       │
       ▼
3. 发现 mcpServers 配置，启动 MCP Server 子进程
   命令: npx universal-db-mcp --type mysql --host ... --password ...
       │
       ▼
4. MCP Server 启动，通过 stdio 与 Claude Desktop 建立通信
       │
       ▼
5. MCP Server 向 Claude Desktop 注册可用的 Tools:
   - execute_query: 执行 SQL 查询
   - get_schema: 获取数据库结构
   - get_table_info: 获取表详情
   - clear_cache: 清除缓存
       │
       ▼
6. Claude Desktop 将 Tools 信息传递给 Claude AI
   (AI 现在知道有哪些工具可用)
```

### 第二阶段：用户提问

```
用户: "帮我查看 users 表有多少条数据"
       │
       ▼
Claude Desktop 将消息发送给 Claude AI
       │
       ▼
Claude AI 分析:
  - 用户想知道表的行数
  - 需要执行 SQL: SELECT COUNT(*) FROM users
  - 应该调用 execute_query 工具
       │
       ▼
Claude AI 生成 Tool 调用请求:
{
  "method": "tools/call",
  "params": {
    "name": "execute_query",
    "arguments": {
      "query": "SELECT COUNT(*) FROM users"
    }
  }
}
```

### 第三阶段：MCP 通信

```
Claude Desktop 通过 stdio 发送 JSON-RPC 请求给 MCP Server
       │
       │  stdin ──────────────────────────────────►
       │  {"jsonrpc":"2.0","method":"tools/call",...}
       │
       ▼
MCP Server (universal-db-mcp) 接收请求
       │
       ▼
解析请求，识别要调用的 Tool: execute_query
       │
       ▼
安全检查:
  - 是否为写操作？ → 否
  - 只读模式是否允许？ → 是
       │
       ▼
执行数据库查询:
  adapter.executeQuery("SELECT COUNT(*) FROM users")
       │
       ▼
数据库返回结果: [{ "COUNT(*)": 12345 }]
       │
       ▼
MCP Server 通过 stdout 返回结果
       │
       │  ◄────────────────────────────────── stdout
       │  {"jsonrpc":"2.0","result":{"rows":[{"COUNT(*)":12345}]}}
       │
       ▼
Claude Desktop 接收结果，传递给 Claude AI
```

### 第四阶段：AI 生成回复

```
Claude AI 收到 Tool 执行结果:
{
  "rows": [{ "COUNT(*)": 12345 }],
  "executionTime": 15
}
       │
       ▼
Claude AI 理解结果，生成自然语言回复:
"users 表目前有 12,345 条数据。"
       │
       ▼
Claude Desktop 显示回复给用户
```

---

## MCP 协议细节

### 通信方式

```
┌──────────────────┐     stdio (stdin/stdout)     ┌──────────────────┐
│  Claude Desktop  │ ◄──────────────────────────► │   MCP Server     │
│  (MCP Client)    │      JSON-RPC 2.0            │ (universal-db-mcp)│
└──────────────────┘                              └──────────────────┘
```

- **传输层**: stdio（标准输入/输出）
- **协议**: JSON-RPC 2.0
- **编码**: UTF-8

### 消息类型

#### 1. 初始化握手

```json
// Client → Server
{"jsonrpc":"2.0","method":"initialize","params":{"capabilities":{}},"id":1}

// Server → Client
{"jsonrpc":"2.0","result":{"capabilities":{"tools":{}}},"id":1}
```

#### 2. 列出可用工具

```json
// Client → Server
{"jsonrpc":"2.0","method":"tools/list","id":2}

// Server → Client
{
  "jsonrpc":"2.0",
  "result":{
    "tools":[
      {"name":"execute_query","description":"执行SQL查询","inputSchema":{...}},
      {"name":"get_schema","description":"获取数据库结构","inputSchema":{...}}
    ]
  },
  "id":2
}
```

#### 3. 调用工具

```json
// Client → Server
{
  "jsonrpc":"2.0",
  "method":"tools/call",
  "params":{
    "name":"execute_query",
    "arguments":{"query":"SELECT * FROM users LIMIT 10"}
  },
  "id":3
}

// Server → Client
{
  "jsonrpc":"2.0",
  "result":{
    "content":[{
      "type":"text",
      "text":"{\"rows\":[...],\"executionTime\":25}"
    }]
  },
  "id":3
}
```

---

## 完整时序图

```
用户          Claude Desktop       Claude AI         MCP Server         数据库
 │                 │                  │                  │                │
 │  1.输入问题     │                  │                  │                │
 │────────────────►│                  │                  │                │
 │                 │  2.发送消息      │                  │                │
 │                 │─────────────────►│                  │                │
 │                 │                  │                  │                │
 │                 │                  │ 3.分析意图       │                │
 │                 │                  │ 决定调用Tool     │                │
 │                 │                  │                  │                │
 │                 │  4.Tool调用请求  │                  │                │
 │                 │◄─────────────────│                  │                │
 │                 │                  │                  │                │
 │                 │  5.JSON-RPC (stdin)                 │                │
 │                 │─────────────────────────────────────►│                │
 │                 │                  │                  │                │
 │                 │                  │                  │  6.SQL查询     │
 │                 │                  │                  │───────────────►│
 │                 │                  │                  │                │
 │                 │                  │                  │  7.查询结果    │
 │                 │                  │                  │◄───────────────│
 │                 │                  │                  │                │
 │                 │  8.JSON-RPC (stdout)                │                │
 │                 │◄─────────────────────────────────────│                │
 │                 │                  │                  │                │
 │                 │  9.Tool执行结果  │                  │                │
 │                 │─────────────────►│                  │                │
 │                 │                  │                  │                │
 │                 │                  │ 10.生成回复      │                │
 │                 │                  │                  │                │
 │                 │  11.AI回复       │                  │                │
 │                 │◄─────────────────│                  │                │
 │                 │                  │                  │                │
 │  12.显示结果   │                  │                  │                │
 │◄────────────────│                  │                  │                │
 │                 │                  │                  │                │
```

---

## 关键点总结

| 环节 | 负责方 | 职责 |
|------|--------|------|
| 理解用户意图 | AI (Claude) | 分析自然语言，决定需要什么数据 |
| 生成 SQL | AI (Claude) | 根据意图和 Schema 生成正确的 SQL |
| 决定调用哪个 Tool | AI (Claude) | 选择 execute_query / get_schema 等 |
| 执行 Tool | MCP Server | 接收请求，执行数据库操作 |
| 安全控制 | MCP Server | 只读模式检查，防止危险操作 |
| 数据库交互 | MCP Server | 通过适配器连接并查询数据库 |
| 格式化结果 | AI (Claude) | 将查询结果转换为自然语言 |

**核心理念**: AI 负责"思考"（理解意图、生成 SQL），MCP Server 负责"执行"（连接数据库、运行查询）。

---

## 相关资源

- [MCP 协议规范](https://modelcontextprotocol.io/)
- [项目架构说明](./architecture.md)
- [添加新数据库支持](./adding-database.md)

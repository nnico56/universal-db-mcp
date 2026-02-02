<p align="center">
  <img src="assets/logo.png" alt="Universal DB MCP Logo" width="200">
</p>

<h1 align="center">Universal DB MCP</h1>

<p align="center">
  <strong>用自然语言连接 AI 与你的数据库</strong>
</p>

<p align="center">
  一个实现了模型上下文协议（MCP）和 HTTP API 的通用数据库连接器，让 AI 助手能够使用自然语言查询和分析你的数据库。支持 Claude Desktop、Cherry Studio、Coze、n8n、Dify 等平台。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/universal-db-mcp"><img src="https://img.shields.io/npm/v/universal-db-mcp.svg?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/universal-db-mcp"><img src="https://img.shields.io/npm/dm/universal-db-mcp.svg?style=flat-square&color=green" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=flat-square" alt="Node.js Version"></a>
  <a href="https://github.com/Anarkh-Lee/universal-db-mcp/stargazers"><img src="https://img.shields.io/github/stars/Anarkh-Lee/universal-db-mcp?style=flat-square" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="#-特性">特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-支持的数据库">数据库</a> •
  <a href="#-文档">文档</a> •
  <a href="#-贡献">贡献</a>
</p>

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文文档</a>
</p>

---

## 为什么选择 Universal DB MCP？

想象一下，你问 AI 助手：*"帮我查一下这个月订单金额最高的 10 个客户"*，然后立即从数据库获得结果——无需编写 SQL。Universal DB MCP 通过模型上下文协议（MCP）和 HTTP API 将 AI 助手与你的数据库连接起来，让这一切成为可能。

```
你: "最近 30 天注册用户的平均订单金额是多少？"

AI: 让我帮你查询一下...

┌─────────────────────────────────────┐
│ 平均订单金额: ¥127.45               │
│ 新用户总数: 1,247                   │
│ 有订单的用户: 892 (71.5%)           │
└─────────────────────────────────────┘
```

## ✨ 特性

- **支持 17 种数据库** - MySQL、PostgreSQL、Redis、Oracle、SQL Server、MongoDB、SQLite，以及 10 种国产数据库
- **灵活架构** - 2 种启动模式（stdio/http），4 种接入方式：MCP stdio、MCP SSE、MCP Streamable HTTP、REST API
- **安全第一** - 默认只读模式，防止意外的数据修改
- **智能缓存** - Schema 缓存支持可配置的 TTL，性能极速
- **批量查询优化** - 大型数据库的 Schema 获取速度提升高达 100 倍

### 性能提升

| 表数量 | 优化前 | 优化后 | 提升 |
|--------|--------|--------|------|
| 50 张表 | ~5 秒 | ~200 毫秒 | **25 倍** |
| 100 张表 | ~10 秒 | ~300 毫秒 | **33 倍** |
| 500 张表 | ~50 秒 | ~500 毫秒 | **100 倍** |

## 🚀 快速开始

### 安装

```bash
npm install -g universal-db-mcp
```

### MCP 模式（Claude Desktop）

将以下配置添加到 Claude Desktop 配置文件：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-database": {
      "command": "npx",
      "args": [
        "universal-db-mcp",
        "--type", "mysql",
        "--host", "localhost",
        "--port", "3306",
        "--user", "root",
        "--password", "your_password",
        "--database", "your_database"
      ]
    }
  }
}
```

重启 Claude Desktop，然后开始提问：

- *"帮我查看 users 表的结构"*
- *"统计最近 7 天的订单数量"*
- *"找出销量最高的 5 个产品"*

### HTTP API 模式

```bash
# 设置环境变量
export MODE=http
export HTTP_PORT=3000
export API_KEYS=your-secret-key

# 启动服务
npx universal-db-mcp
```

```bash
# 测试 API
curl http://localhost:3000/api/health
```

### MCP SSE 模式（Dify 和远程访问）

在 HTTP 模式下运行时，服务器还会通过 SSE（Server-Sent Events）和 Streamable HTTP 暴露 MCP 协议端点。这使得 Dify 等平台可以直接使用 MCP 协议连接。

**SSE 端点（传统方式）：**
```
GET http://localhost:3000/sse?type=mysql&host=localhost&port=3306&user=root&password=xxx&database=mydb
```

**Streamable HTTP 端点（MCP 2025 规范，推荐）：**
```
POST http://localhost:3000/mcp
请求头：
  X-DB-Type: mysql
  X-DB-Host: localhost
  X-DB-Port: 3306
  X-DB-User: root
  X-DB-Password: your_password
  X-DB-Database: your_database
请求体：MCP JSON-RPC 请求
```

| 端点 | 方法 | 说明 |
|------|------|------|
| `/sse` | GET | 建立 SSE 连接（传统方式） |
| `/sse/message` | POST | 向 SSE 会话发送消息 |
| `/mcp` | POST | Streamable HTTP 端点（推荐） |
| `/mcp` | GET | Streamable HTTP 的 SSE 流 |
| `/mcp` | DELETE | 关闭会话 |

详细配置说明请参阅 [Dify 集成指南](./docs/integrations/DIFY.zh-CN.md)。

## 📊 支持的数据库

| 数据库 | 类型参数 | 默认端口 | 分类 |
|--------|----------|----------|------|
| MySQL | `mysql` | 3306 | 开源 |
| PostgreSQL | `postgres` | 5432 | 开源 |
| Redis | `redis` | 6379 | NoSQL |
| Oracle | `oracle` | 1521 | 商业 |
| SQL Server | `sqlserver` | 1433 | 商业 |
| MongoDB | `mongodb` | 27017 | NoSQL |
| SQLite | `sqlite` | - | 嵌入式 |
| 达梦 | `dm` | 5236 | 国产 |
| 人大金仓 | `kingbase` | 54321 | 国产 |
| 华为 GaussDB | `gaussdb` | 5432 | 国产 |
| 蚂蚁 OceanBase | `oceanbase` | 2881 | 国产 |
| TiDB | `tidb` | 4000 | 分布式 |
| ClickHouse | `clickhouse` | 8123 | OLAP |
| 阿里云 PolarDB | `polardb` | 3306 | 云数据库 |
| 海量 Vastbase | `vastbase` | 5432 | 国产 |
| 瀚高 HighGo | `highgo` | 5866 | 国产 |
| 中兴 GoldenDB | `goldendb` | 3306 | 国产 |

## 🏗️ 架构

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Universal DB MCP                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  启动模式：                                                           │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │ stdio 模式           │ http 模式                             │     │
│  │ (npm run start:mcp)  │ (npm run start:http)                  │     │
│  └──────────┬───────────┴──────────────┬───────────────────────┘     │
│             │                          │                              │
│  接入方式：                             │                              │
│  ┌──────────▼──────────┐  ┌───────────▼───────────────────────┐     │
│  │     MCP stdio       │  │ MCP SSE  │ MCP Streamable │ REST  │     │
│  │  (Claude Desktop)   │  │ (传统)   │ HTTP (推荐)    │ API   │     │
│  └──────────┬──────────┘  └──────────┬────────────┬───┬───────┘     │
│             │                        │            │   │              │
│             └────────────────────────┴────────────┴───┘              │
│                                      │                               │
│  ┌───────────────────────────────────▼───────────────────────────┐  │
│  │                      核心业务逻辑层                             │  │
│  │  • 查询执行          • Schema 缓存                            │  │
│  │  • 安全校验          • 连接管理                               │  │
│  └───────────────────────────────────┬───────────────────────────┘  │
│                                      ▼                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     数据库适配器层                              │  │
│  │  MySQL │ PostgreSQL │ Redis │ Oracle │ MongoDB │ ...          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 🔒 安全

默认情况下，Universal DB MCP 运行在**只读模式**，会阻止所有写操作（INSERT、UPDATE、DELETE、DROP 等）。

如需启用写操作（请谨慎使用！）：

```bash
--danger-allow-write
```

**最佳实践：**
- 生产环境永远不要启用写入模式
- 使用专用的只读数据库账号
- 通过 VPN 或跳板机连接
- 定期审计查询日志

## 📚 文档

### 快速开始
- [安装指南](./docs/getting-started/installation.md)
- [快速开始](./docs/getting-started/quick-start.md)
- [配置说明](./docs/getting-started/configuration.md)
- [使用示例](./docs/getting-started/examples.md)

### 部署
- [部署概览](./docs/deployment/README.md)
- [本地部署](./docs/deployment/local.md)
- [Docker 部署](./docs/deployment/docker.md)
- [云服务部署](./docs/deployment/cloud/)

### 数据库指南
- [数据库支持概览](./docs/databases/README.md)
- [MySQL](./docs/databases/mysql.md)
- [PostgreSQL](./docs/databases/postgresql.md)
- [更多数据库...](./docs/databases/)

### HTTP API
- [API 参考](./docs/http-api/API_REFERENCE.md)
- [部署指南](./docs/http-api/DEPLOYMENT.md)

### 集成
- [Coze 集成](./docs/integrations/COZE.md)
- [n8n 集成](./docs/integrations/N8N.md)
- [Dify 集成](./docs/integrations/DIFY.md)

### 进阶
- [安全指南](./docs/guides/security.md)
- [多租户指南](./docs/guides/multi-tenant.md)
- [架构说明](./docs/development/architecture.md)
- [故障排查](./docs/operations/troubleshooting.md)

## 🤝 贡献

欢迎贡献代码！请在提交 Pull Request 之前阅读我们的[贡献指南](./CONTRIBUTING.md)。

```bash
# 克隆仓库
git clone https://github.com/Anarkh-Lee/universal-db-mcp.git

# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test
```

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

## 🌟 Star 历史

如果你觉得这个项目有用，请考虑给它一个 Star！你的支持帮助我们持续改进 Universal DB MCP。

[![Star History Chart](https://api.star-history.com/svg?repos=Anarkh-Lee/universal-db-mcp&type=Date)](https://star-history.com/#Anarkh-Lee/universal-db-mcp&Date)

## 📝 更新日志

详见 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本历史。

---

<p align="center">
  由 <a href="https://github.com/Anarkh-Lee">Anarkh-Lee</a> 用 ❤️ 打造
</p>

<p align="center">
  <img src="assets/logo.png" alt="Universal DB MCP Logo" width="200">
</p>

<h1 align="center">Universal DB MCP</h1>

<p align="center">
  <strong>Connect AI to Your Database with Natural Language</strong>
</p>

<p align="center">
  A universal database connector implementing the Model Context Protocol (MCP) and HTTP API, enabling AI assistants to query and analyze your databases using natural language. Works with Claude Desktop, Cherry Studio, Coze, n8n, Dify, and more.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/universal-db-mcp"><img src="https://img.shields.io/npm/v/universal-db-mcp.svg?style=flat-square&color=blue" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/universal-db-mcp"><img src="https://img.shields.io/npm/dm/universal-db-mcp.svg?style=flat-square&color=green" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=flat-square" alt="Node.js Version"></a>
  <a href="https://github.com/Anarkh-Lee/universal-db-mcp/stargazers"><img src="https://img.shields.io/github/stars/Anarkh-Lee/universal-db-mcp?style=flat-square" alt="GitHub Stars"></a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-supported-databases">Databases</a> •
  <a href="#-documentation">Docs</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文文档</a>
</p>

---

## Why Universal DB MCP?

Imagine asking your AI assistant: *"Show me the top 10 customers by order value this month"* and getting instant results from your database - no SQL writing required. Universal DB MCP makes this possible by bridging AI assistants with your databases through the Model Context Protocol (MCP) and HTTP API.

```
You: "What's the average order value for users who signed up in the last 30 days?"

AI: Let me query that for you...

┌─────────────────────────────────────┐
│ Average Order Value: $127.45        │
│ Total New Users: 1,247              │
│ Users with Orders: 892 (71.5%)      │
└─────────────────────────────────────┘
```

## ✨ Features

- **17 Database Support** - MySQL, PostgreSQL, Redis, Oracle, SQL Server, MongoDB, SQLite, and 10 Chinese domestic databases
- **Flexible Architecture** - 2 startup modes (stdio/http) with 4 access methods: MCP stdio, MCP SSE, MCP Streamable HTTP, and REST API
- **Security First** - Read-only mode by default prevents accidental data modifications
- **Intelligent Caching** - Schema caching with configurable TTL for blazing-fast performance
- **Batch Query Optimization** - Up to 100x faster schema retrieval for large databases

### Performance Improvements

| Tables | Before | After | Improvement |
|--------|--------|-------|-------------|
| 50 tables | ~5s | ~200ms | **25x faster** |
| 100 tables | ~10s | ~300ms | **33x faster** |
| 500 tables | ~50s | ~500ms | **100x faster** |

## 🚀 Quick Start

### Installation

```bash
npm install -g universal-db-mcp
```

### MCP Mode (Claude Desktop)

Add to your Claude Desktop configuration file:

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

Restart Claude Desktop and start asking questions:

- *"Show me the structure of the users table"*
- *"Count orders from the last 7 days"*
- *"Find the top 5 products by sales"*

### HTTP API Mode

```bash
# Set environment variables
export MODE=http
export HTTP_PORT=3000
export API_KEYS=your-secret-key

# Start the server
npx universal-db-mcp
```

```bash
# Test the API
curl http://localhost:3000/api/health
```

### MCP SSE Mode (Dify and Remote Access)

When running in HTTP mode, the server also exposes MCP protocol endpoints via SSE (Server-Sent Events) and Streamable HTTP. This allows platforms like Dify to connect using the MCP protocol directly.

**SSE Endpoint (Legacy):**
```
GET http://localhost:3000/sse?type=mysql&host=localhost&port=3306&user=root&password=xxx&database=mydb
```

**Streamable HTTP Endpoint (MCP 2025 Spec, Recommended):**
```
POST http://localhost:3000/mcp
Headers:
  X-DB-Type: mysql
  X-DB-Host: localhost
  X-DB-Port: 3306
  X-DB-User: root
  X-DB-Password: your_password
  X-DB-Database: your_database
Body: MCP JSON-RPC request
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sse` | GET | Establish SSE connection (legacy) |
| `/sse/message` | POST | Send message to SSE session |
| `/mcp` | POST | Streamable HTTP endpoint (recommended) |
| `/mcp` | GET | SSE stream for Streamable HTTP |
| `/mcp` | DELETE | Close session |

See [Dify Integration Guide](./docs/integrations/DIFY.md) for detailed setup instructions.

## 📊 Supported Databases

| Database | Type | Default Port | Category |
|----------|------|--------------|----------|
| MySQL | `mysql` | 3306 | Open Source |
| PostgreSQL | `postgres` | 5432 | Open Source |
| Redis | `redis` | 6379 | NoSQL |
| Oracle | `oracle` | 1521 | Commercial |
| SQL Server | `sqlserver` | 1433 | Commercial |
| MongoDB | `mongodb` | 27017 | NoSQL |
| SQLite | `sqlite` | - | Embedded |
| Dameng (达梦) | `dm` | 5236 | Chinese |
| KingbaseES | `kingbase` | 54321 | Chinese |
| GaussDB | `gaussdb` | 5432 | Chinese (Huawei) |
| OceanBase | `oceanbase` | 2881 | Chinese (Ant) |
| TiDB | `tidb` | 4000 | Distributed |
| ClickHouse | `clickhouse` | 8123 | OLAP |
| PolarDB | `polardb` | 3306 | Cloud (Alibaba) |
| Vastbase | `vastbase` | 5432 | Chinese |
| HighGo | `highgo` | 5866 | Chinese |
| GoldenDB | `goldendb` | 3306 | Chinese (ZTE) |

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Universal DB MCP                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Startup Modes:                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │ stdio mode          │ http mode                              │     │
│  │ (npm run start:mcp) │ (npm run start:http)                   │     │
│  └──────────┬──────────┴──────────────┬────────────────────────┘     │
│             │                         │                               │
│  Access Methods:                      │                               │
│  ┌──────────▼──────────┐  ┌──────────▼────────────────────────┐     │
│  │     MCP stdio       │  │  MCP SSE    │ MCP Streamable │ REST │     │
│  │  (Claude Desktop)   │  │  (legacy)   │ HTTP (recommended)│ API │     │
│  └──────────┬──────────┘  └──────────┬─────────────┬──────┬───┘     │
│             │                        │             │      │          │
│             └────────────────────────┴─────────────┴──────┘          │
│                                      │                               │
│  ┌───────────────────────────────────▼───────────────────────────┐  │
│  │                    Core Business Logic                         │  │
│  │  • Query Execution    • Schema Caching                        │  │
│  │  • Safety Validation  • Connection Management                 │  │
│  └───────────────────────────────────┬───────────────────────────┘  │
│                                      ▼                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Database Adapter Layer                       │  │
│  │  MySQL │ PostgreSQL │ Redis │ Oracle │ MongoDB │ ...          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 🔒 Security

By default, Universal DB MCP runs in **read-only mode**, blocking all write operations (INSERT, UPDATE, DELETE, DROP, etc.).

To enable write operations (use with caution!):

```bash
--danger-allow-write
```

**Best Practices:**
- Never enable write mode in production
- Use dedicated read-only database accounts
- Connect through VPN or bastion hosts
- Regularly audit query logs

## 📚 Documentation

### Getting Started
- [Installation Guide](./docs/getting-started/installation.md)
- [Quick Start](./docs/getting-started/quick-start.md)
- [Configuration](./docs/getting-started/configuration.md)
- [Usage Examples](./docs/getting-started/examples.md)

### Deployment
- [Deployment Overview](./docs/deployment/README.md)
- [Local Deployment](./docs/deployment/local.md)
- [Docker Deployment](./docs/deployment/docker.md)
- [Cloud Deployment](./docs/deployment/cloud/)

### Database Guides
- [Database Support Overview](./docs/databases/README.md)
- [MySQL](./docs/databases/mysql.md)
- [PostgreSQL](./docs/databases/postgresql.md)
- [More databases...](./docs/databases/)

### HTTP API
- [API Reference](./docs/http-api/API_REFERENCE.md)
- [Deployment Guide](./docs/http-api/DEPLOYMENT.md)

### Integrations
- [Coze Integration](./docs/integrations/COZE.md)
- [n8n Integration](./docs/integrations/N8N.md)
- [Dify Integration](./docs/integrations/DIFY.md)

### Advanced
- [Security Guide](./docs/guides/security.md)
- [Multi-tenant Guide](./docs/guides/multi-tenant.md)
- [Architecture](./docs/development/architecture.md)
- [Troubleshooting](./docs/operations/troubleshooting.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request.

```bash
# Clone the repository
git clone https://github.com/Anarkh-Lee/universal-db-mcp.git

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 🌟 Star History

If you find this project useful, please consider giving it a star! Your support helps us continue improving Universal DB MCP.

[![Star History Chart](https://api.star-history.com/svg?repos=Anarkh-Lee/universal-db-mcp&type=Date)](https://star-history.com/#Anarkh-Lee/universal-db-mcp&Date)

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed version history.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Anarkh-Lee">Anarkh-Lee</a>
</p>

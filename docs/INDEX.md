# 📚 Bolt Memory Documentation Index

**Last Updated:** 2026-03-21  
**Version:** 4.8.2

---

## 🚀 Quick Start

| Document | Purpose | For |
|----------|---------|-----|
| **[README.md](../README.md)** | Project overview, 30-second setup | Everyone |
| **[docs/quick-start.md](user-guide/quick-start.md)** | Simplified getting started | New users |
| **[docs/user-guide/qwen-integration.md](user-guide/qwen-integration.md)** | Qwen Code setup | Qwen users |
| **[docs/user-guide/mcp-setup.md](user-guide/mcp-setup.md)** | MCP server configuration | Developers |

---

## 📖 User Guide

### **Getting Started**
- [Quick Start](user-guide/quick-start.md) - 5-minute setup
- [Installation](user-guide/installation.md) - Detailed install guide
- [Qwen Integration](user-guide/qwen-integration.md) - Qwen Code setup
- [MCP Setup](user-guide/mcp-setup.md) - MCP server configuration

### **Usage**
- [CLI Commands](user-guide/cli-commands.md) - All `anchor` commands
- [Search Examples](user-guide/search-examples.md) - Query patterns
- [Configuration](user-guide/configuration.md) - Settings reference
- [Best Practices](user-guide/best-practices.md) - Usage tips

### **Troubleshooting**
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues
- [FAQ](user-guide/faq.md) - Frequently asked questions
- [Error Codes](user-guide/error-codes.md) - Error reference

---

## 🔧 API Reference

| Document | Purpose |
|----------|---------|
| **[API.md](API.md)** | Complete API reference |
| **[MCP Tools](integrations/mcp-tools.md)** | MCP server tools |
| **[Endpoints](api-reference/endpoints.md)** | HTTP endpoints |
| **[Schemas](api-reference/schemas.md)** | Data schemas |

---

.

## 🏛️ Architecture

### **Core Concepts**
- [Whitepaper](whitepaper.md) - STAR Algorithm academic paper
- [Executive Summary](STAR_Whitepaper_Executive.md) - TL;DR version
- [System Spec](../specs/spec.md) - Technical specification
- [Architecture Overview](architecture/overview.md) - System design

### **Standards**
- **[Active Standards](../specs/current-standards/)** - Current standards (001-010)
- **[Standard 132](architecture/standards/standard-132.md)** - Search Content Return
- **[Standard 133](architecture/standards/standard-133.md)** - Startup Banner
- **[Standard 134](architecture/standards/standard-134.md)** - Settings Unity
- **[Standard 135](architecture/standards/standard-135.md)** - Watchdog Auto-Enable
- **[Standard 136](architecture/standards/standard-136.md)** - Streaming Search
- **[Archive](../specs/archive-standards/)** - Historical standards (059-136+)

### **Algorithms**
- [Recursive Search Fallbacks](../RECURSIVE_SEARCH_FALLBACKS.md) - 6-level search strategy
- [Physics Tag Walker](architecture/physics-tag-walker.md) - Graph traversal
- [Radial Distillation](architecture/radial-distillation.md) - Knowledge compression
- [Mirror Protocol](architecture/mirror-protocol.md) - File system reflection

---

## 👩‍💻 Development

### **Contributing**
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)** - Community standards
- [Development Setup](development/setup.md) - Local development
- [Testing Guide](development/testing.md) - Testing framework
- [Code Patterns](code-patterns.md) - Coding standards

### **Project Management**
- **[specs/tasks.md](../specs/tasks.md)** - Current tasks
- **[specs/plan.md](../specs/plan.md)** - Project roadmap
- [Project Status](project/status.md) - Current status
- [Daily Notes](daily/) - Daily development logs

---

## 🔌 Integrations

| Integration | Document | Status |
|-------------|----------|--------|
| **Qwen Code** | [user-guide/qwen-integration.md](user-guide/qwen-integration.md) | ✅ Active |
| **MCP Server** | [integrations/mcp-server.md](integrations/mcp-server.md) | ✅ Active |
| **Claude Desktop** | [integrations/claude-desktop.md](integrations/claude-desktop.md) | 🚧 Planned |
| **Cursor IDE** | [integrations/cursor.md](integrations/cursor.md) | 🚧 Planned |
| **Continue.dev** | [integrations/continue.md](integrations/continue.md) | 🚧 Planned |

---

## 📊 Project Documentation

### **Status & Planning**
- [Project Status](project/status.md) - Current state
- [Roadmap](../specs/plan.md) - Future plans
- [Tasks](../specs/tasks.md) - Active tasks

### **Reviews & Analysis**
- [Code Reviews](reviews/) - PR reviews
- [Performance Analysis](project/performance.md) - Benchmarks
- [Security Audit](project/security.md) - Security review

### **Historical**
- [Daily Notes](daily/) - Development logs
- [arXiv Submission](arxiv/) - Academic paper
- [Project History](project/history.md) - Timeline

---

## 🐛 Known Issues & Improvements

| Document | Purpose |
|----------|---------|
| **[PAIN_POINTS_DOCUMENTATION.md](../PAIN_POINTS_DOCUMENTATION.md)** | 12 pain points documented with fixes |
| **[FRICTIONLESS_SPEC.md](../FRICTIONLESS_SPEC.md)** | Future improvements specification |
| **[CHANGELOG.md](../CHANGELOG.md)** | Version history, bug fixes |

---

## 📦 Deployment

| Document | Purpose |
|----------|---------|
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production deployment |
| **[guides/android-termux.md](guides/android-termux.md)** | Termux installation |
| **[guides/docker.md](guides/docker.md)** | Docker deployment |
| **[guides/kubernetes.md](guides/kubernetes.md)** | Kubernetes deployment |

---

## 🎯 Documentation by Role

### **For New Users**
1. Start with [README.md](../README.md)
2. Read [Quick Start](user-guide/quick-start.md)
3. Follow [Qwen Integration](user-guide/qwen-integration.md)
4. Reference [Troubleshooting](TROUBLESHOOTING.md) if needed

### **For Developers**
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Review [Development Setup](development/setup.md)
3. Study [Architecture Overview](architecture/overview.md)
4. Check [Code Patterns](code-patterns.md)

### **For Researchers**
1. Read [Whitepaper](whitepaper.md)
2. Review [Executive Summary](STAR_Whitepaper_Executive.md)
3. Study [STAR Algorithm](architecture/star-algorithm.md)
4. Reference [API.md](API.md)

### **For DevOps**
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Review [guides/android-termux.md](guides/android-termux.md)
3. Check [Monitoring](project/monitoring.md)
4. Reference [Error Codes](user-guide/error-codes.md)

---

## 📝 Documentation Standards

All documentation follows these standards:

- **Naming:** lowercase-with-hyphens.md
- **Headers:** H1 for title, H2 for sections, H3 for subsections
- **Code:** Fenced code blocks with language specifier
- **Links:** Relative links within project, absolute for external
- **Updates:** Include "Last Updated" date at bottom

---

## 🔍 Finding Documents

### **By Topic**

| Topic | Documents |
|-------|-----------|
| **Installation** | README.md, user-guide/installation.md, guides/android-termux.md |
| **Configuration** | user-guide/configuration.md, ../user_settings.json |
| **Search** | user-guide/search-examples.md, ../RECURSIVE_SEARCH_FALLBACKS.md |
| **MCP** | user-guide/mcp-setup.md, integrations/mcp-server.md |
| **Troubleshooting** | TROUBLESHOOTING.md, user-guide/faq.md |
| **Architecture** | architecture/overview.md, ../specs/spec.md |
| **Standards** | ../specs/current-standards/, architecture/standards/ |
| **Development** | development/setup.md, ../CONTRIBUTING.md |

### **By File Type**

| Type | Location |
|------|----------|
| **Guides** | docs/user-guide/, docs/guides/ |
| **Reference** | docs/api-reference/, docs/architecture/ |
| **Project** | docs/project/, ../specs/ |
| **Historical** | docs/daily/, docs/arxiv/, ../specs/archive-standards/ |

---

## 📚 Related Projects

- **[Anchor Engine](https://github.com/RSBalchII/anchor-engine-node)** - Core project
- **[Anchor Android](https://github.com/RSBalchII/anchor-android)** - Android app
- **[npm Package](https://www.npmjs.com/package/@rbalchii/anchor-engine)** - Published package

---

**Need Help?** Open an issue on [GitHub](https://github.com/RSBalchII/Bolt/issues)  
**Want to Contribute?** See [CONTRIBUTING.md](../CONTRIBUTING.md)

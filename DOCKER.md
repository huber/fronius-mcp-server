# Fronius MCP Server

[![GitHub release](https://img.shields.io/github/v/release/huber/fronius-mcp-server)](https://github.com/huber/fronius-mcp-server/releases)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://github.com/huber/fronius-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server for the Fronius Solar API. This server enables access to Fronius inverter data through the MCP protocol for direct use in Claude Desktop.

## Quick Start with Docker

**1. Pull the Docker Image**
```bash
docker pull dirkhuber/fronius-mcp-server:latest
```

**2. Configure Claude Desktop**

Edit your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Basic Configuration:**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "FRONIUS_HOST=fronius-inverter.local",
        "dirkhuber/fronius-mcp-server:latest"
      ]
    }
  }
}
```

**Advanced Configuration with HTTPS:**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "FRONIUS_HOST=192.168.1.100",
        "-e", "FRONIUS_PROTOCOL=https",
        "-e", "FRONIUS_PORT=443",
        "-e", "FRONIUS_TIMEOUT=15000",
        "dirkhuber/fronius-mcp-server:latest"
      ]
    }
  }
}
```

**3. Restart Claude Desktop and Test**
- Completely quit and restart Claude Desktop
- Start a new conversation
- Test with: *"How much power is my solar system producing?"*

## Environment Variables

- `FRONIUS_HOST` - Hostname/IP of Fronius device (required)
- `FRONIUS_PORT` - Port (default: 80)
- `FRONIUS_PROTOCOL` - Protocol: http/https (default: http)
- `FRONIUS_TIMEOUT` - Request timeout in ms (default: 10000)
- `FRONIUS_DEVICE_ID` - Default device ID (default: 1)
- `FRONIUS_RETRIES` - Retry attempts (default: 3)
- `FRONIUS_RETRY_DELAY` - Delay between retries in ms (default: 1000)
- `LOG_LEVEL` - Log level: error/warn/info/debug (default: info)

## Supported Fronius API Endpoints

### System & Status
- API Version, System Status, LED Status, Active Devices

### Inverter Data
- Static information and real-time data with various DataCollections

### Smart Meter & Power Flow
- Smart meter real-time data and energy flow visualization

### Battery Storage
- Battery storage system data (state of charge, power, temperature)

### Smart Home Integration
- OhmPilot smart heating element controller data

### Extended Features
- Archive data, environmental sensors, DC string data

## How It Works

- **Automatic Lifecycle**: Claude Desktop starts a fresh container for each session
- **Environment Configuration**: Pass variables as `-e` parameters
- **Auto-Cleanup**: `--rm` flag removes container when session ends
- **Multi-Platform**: Supports AMD64 and ARM64 architectures

## Links

- **GitHub Repository**: [https://github.com/huber/fronius-mcp-server](https://github.com/huber/fronius-mcp-server)
- **Full Documentation**: [README.md](https://github.com/huber/fronius-mcp-server#readme)
- **Issues & Support**: [GitHub Issues](https://github.com/huber/fronius-mcp-server/issues)

## License

MIT License - see [LICENSE](https://github.com/huber/fronius-mcp-server/blob/main/LICENSE)
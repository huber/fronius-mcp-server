# Fronius MCP Server

[![GitHub release](https://img.shields.io/github/v/release/huber/fronius-mcp-server)](https://github.com/huber/fronius-mcp-server/releases)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://github.com/huber/fronius-mcp-server)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server for the Fronius Solar API. This server enables access to Fronius inverter data through the MCP protocol for direct use in Claude Desktop or any other MCP host application. 

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

Replace the `FRONIUS_HOST`value with the DNS name or ip adress of your inverter. 

**3. Enable Fronius Solar API**
⚠️ **Important**: The Fronius Solar API must be enabled on your inverter:
- Open your Fronius inverter web interface (usually `http://fronius-inverter.local` or your inverter's IP)
- Navigate to: **System** → **Hardware** → **Datamanager**
- Ensure **Solar API** is **enabled**

**4. Restart Claude Desktop and Test**
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

## Troubleshooting

**Connection Issues:**
1. **Check hostname/IP**: `ping fronius-inverter.local` or `ping 192.168.1.100`
2. **Test API access**: `curl "http://fronius-inverter.local/solar_api/GetAPIVersion.cgi"`
3. **Fronius Solar API enabled?**: In Fronius web interface → **System** → **Hardware** → **Datamanager** → **Solar API** must be enabled
4. **Network access**: Ensure no firewall blocks access between Docker and Fronius inverter

## Links

- **GitHub Repository**: [https://github.com/huber/fronius-mcp-server](https://github.com/huber/fronius-mcp-server)
- **Full Documentation**: [README.md](https://github.com/huber/fronius-mcp-server#readme)
- **Issues & Support**: [GitHub Issues](https://github.com/huber/fronius-mcp-server/issues)
- **Fronius API Documentation**: [Official Fronius Solar API](https://www.fronius.com/~/downloads/Solar%2520Energy/Operating%2520Instructions/42,0410,2012.pdf)

## License

MIT License - see [LICENSE](https://github.com/huber/fronius-mcp-server/blob/main/LICENSE)
# Fronius MCP Server

[![CI/CD Pipeline](https://github.com/huber/fronius-mcp-server/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/huber/fronius-mcp-server/actions)
[![Docker Hub](https://img.shields.io/docker/pulls/dirkhuber/fronius-mcp-server)](https://hub.docker.com/r/dirkhuber/fronius-mcp-server)
[![GitHub release](https://img.shields.io/github/v/release/huber/fronius-mcp-server)](https://github.com/huber/fronius-mcp-server/releases)
[![License](https://img.shields.io/github/license/huber/fronius-mcp-server)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server for the Fronius Solar API. This server enables access to Fronius inverter data through the MCP protocol for direct use in Claude Desktop or any other MCP Host Application. 

## Features

- ✅ **Full TypeScript implementation** with strong typing
- ✅ **Comprehensive Fronius Solar API v1 coverage** - all major endpoints
- ✅ **Configurable settings** via environment variables
- ✅ **Both Resources and Tools** for maximum flexibility
- ✅ **Connection testing** on startup and via tools
- ✅ **Claude Desktop integration** with network permissions guide

## Supported Fronius API Endpoints

### System & Status
- `GetAPIVersion.cgi` - API Version
- `GetLoggerInfo.cgi` - System Status
- `GetLoggerLEDInfo.cgi` - LED Status
- `GetActiveDeviceInfo.cgi` - Active Devices

### Inverter
- `GetInverterInfo.cgi` - Static inverter information
- `GetInverterRealtimeData.cgi` - Real-time data (various DataCollections)

### Smart Meter & Power Flow
- `GetMeterRealtimeData.cgi` - Smart meter real-time data
- `GetPowerFlowRealtimeData.fcgi` - Energy flow visualization

### Battery Storage
- `GetStorageRealtimeData.cgi` - Battery storage system data (state of charge, power, temperature)

### Smart Home Integration
- `GetOhmPilotRealtimeData.cgi` - OhmPilot smart heating element controller data

### Extended Features
- `GetArchiveData.cgi` - Archive data with flexible time ranges
- `GetSensorRealtimeData.cgi` - Environmental sensors (temperature, irradiance)
- `GetStringRealtimeData.cgi` - DC string data (voltage, current per string)

## Requirements

- **Node.js 20+** (tested with Node.js 24)
- **npm** or **yarn**

## Installation

```bash
# Clone repository
git clone https://github.com/huber/fronius-mcp-server.git
cd fronius-mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

Available configuration options:

- `FRONIUS_HOST` - Hostname or IP of Fronius device (default: `fronius-inverter`)
- `FRONIUS_PORT` - Port (default: `80`)
- `FRONIUS_PROTOCOL` - Protocol: `http` or `https` (default: `http`)
- `FRONIUS_TIMEOUT` - Request timeout in ms (default: `10000`)
- `FRONIUS_DEVICE_ID` - Default device ID (default: `1`)
- `FRONIUS_RETRIES` - Number of retry attempts (default: `3`)
- `FRONIUS_RETRY_DELAY` - Delay between retries in ms (default: `1000`)
- `LOG_LEVEL` - Log level: `error`, `warn`, `info`, `debug` (default: `info`)

### Example Configurations

**Local Fronius device with hostname:**
```env
FRONIUS_HOST=fronius-inverter.local
```

**With IP address:**
```env
FRONIUS_HOST=192.168.1.100
```

**HTTPS (newer models):**
```env
FRONIUS_HOST=192.168.1.100
FRONIUS_PROTOCOL=https
FRONIUS_PORT=443
```

## Installation Options

### Option 1: NPM Package (Easiest)

The simplest way to install and use the Fronius MCP Server is via npm:

#### Global Installation

**1. Install globally:**
```bash
npm install -g fronius-mcp-server
```

**2. Run directly:**
```bash
# Basic usage
fronius-mcp-server --host fronius-inverter.local

# Advanced usage with HTTPS
fronius-mcp-server --host 192.168.1.100 --protocol https --port 443

# Test connection
fronius-mcp-server --test-connection --host fronius-inverter.local
```

#### Claude Desktop Configuration

Edit your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Basic Configuration:**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "fronius-mcp-server",
      "args": ["--host", "fronius-inverter.local"]
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "fronius-mcp-server",
      "args": [
        "--host", "192.168.1.100",
        "--protocol", "https",
        "--port", "443",
        "--timeout", "15000"
      ]
    }
  }
}
```

#### CLI Options

```bash
fronius-mcp-server --help

Options:
  -h, --host <host>           Fronius inverter hostname or IP address
  -p, --port <port>           Fronius inverter port (default: 80)
  --protocol <protocol>       Protocol http|https (default: http)
  -t, --timeout <timeout>     Request timeout in ms (default: 10000)
  -d, --device-id <deviceId>  Default device ID (default: 1)
  -r, --retries <retries>     Number of retry attempts (default: 3)
  --retry-delay <delay>       Delay between retries in ms (default: 1000)
  -l, --log-level <level>     Log level (default: info)
  --test-connection          Test connection and exit
  --stdio                    Use stdio transport (default for MCP)
  --version                  Show version information
```

#### Advantages of NPM Installation
- ✅ **Zero setup** - No Docker or Node.js project setup required
- ✅ **Global availability** - Use `fronius-mcp-server` from anywhere
- ✅ **Easy updates** - `npm update -g fronius-mcp-server`
- ✅ **Built-in CLI** - Rich command-line interface with help
- ✅ **Cross-platform** - Works on Windows, macOS, Linux

### Option 2: Pre-built Docker Image

The easiest way to run the Fronius MCP Server is using the pre-built Docker image from Docker Hub:

#### Setup Steps

**1. Pull the Pre-built Image**
```bash
# No build required - use the pre-built image
docker pull dirkhuber/fronius-mcp-server:latest
```

#### Claude Desktop Configuration

**Basic Configuration (Hostname):**
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

**Advanced Configuration (IP with HTTPS):**
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

**That's it!** No need to clone the repository or build anything. The pre-built Docker image contains everything needed.

#### Advantages of Pre-built Image
- ✅ **Zero setup** - No cloning, building, or Node.js required
- ✅ **Always up-to-date** - Latest stable version
- ✅ **Multi-platform** - Supports both AMD64 and ARM64 architectures
- ✅ **Automatic updates** - Pull new versions with `docker pull dirkhuber/fronius-mcp-server:latest`

### Option 3: Build Docker Image Yourself

If you prefer to build the image yourself or want to modify the code:

#### Setup Steps

**1. Build the Docker Image**
```bash
# Clone and build the container image
git clone https://github.com/huber/fronius-mcp-server.git
cd fronius-mcp-server
npm run docker:build
```

**2. Configure Claude Desktop**

Edit your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Use the locally built image name `fronius-mcp-server` instead of the Docker Hub image:

**Basic Configuration (Hostname):**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "docker",
      "args": [
        "run", "--rm", "-i",
        "-e", "FRONIUS_HOST=fronius-inverter.local",
        "fronius-mcp-server"
      ]
    }
  }
}
```

**Advanced Configuration (IP with HTTPS):**
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
        "fronius-mcp-server"
      ]
    }
  }
}
```

## How Docker Integration Works

- **Automatic Lifecycle**: Claude Desktop starts a fresh container for each session
- **Environment Variables**: Environment variables are passed directly as `-e` parameters in the `args` array
  - Each environment variable needs its own `-e` parameter
  - Format: `"-e", "VARIABLE_NAME=value"`
- **Auto-Cleanup**: `--rm` flag removes container when session ends
- **No Manual Management**: No need to manually start/stop containers

**Equivalent Docker Command:**
```bash
# For the basic configuration, Claude Desktop effectively runs:
docker run --rm -i \
  -e FRONIUS_HOST=fronius-inverter.local \
  dirkhuber/fronius-mcp-server:latest

# For the advanced configuration, it would run:
docker run --rm -i \
  -e FRONIUS_HOST=192.168.1.100 \
  -e FRONIUS_PROTOCOL=https \
  -e FRONIUS_PORT=443 \
  -e FRONIUS_TIMEOUT=15000 \
  dirkhuber/fronius-mcp-server:latest
```

**Final Steps (for both options):**
1. Edit your Claude Desktop configuration file with one of the configurations above
2. **Completely quit Claude Desktop** and restart it
3. **Begin a new conversation**
4. **Test** with: *"How much power is my solar system producing?"*

#### Alternative: Long-Running Container

If you prefer a long-running container approach:

**Docker Compose Setup:**
```bash
# Use docker-compose for easier management
cp .env.docker .env
# IMPORTANT: Edit .env and set FRONIUS_HOST to your device IP/hostname
# Example: FRONIUS_HOST=fronius-inverter.local or FRONIUS_HOST=192.168.1.100
docker-compose up -d

# Test the setup
./scripts/test-container.sh
```

**Claude Desktop config for long-running container:**
```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "docker",
      "args": ["exec", "-i", "fronius-mcp-server", "node", "dist/server.js"],
      "env": {}
    }
  }
}
```

**Note**: For long-running containers, the `FRONIUS_HOST` is configured when starting the container (via docker-compose.yml or docker run), not in the Claude Desktop config. The `docker exec` command uses the environment from the running container.

### Option 4: Local Development

For development or if you want to build from source:

## Claude Desktop Setup

### 1. MCP Server Configuration

Edit the Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fronius-solar": {
      "command": "node",
      "args": ["/absolute/path/to/fronius-mcp-server/dist/server.js"],
      "env": {
        "FRONIUS_HOST": "fronius-inverter.local"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/fronius-mcp-server` with your actual installation path!

**Finding the correct paths:**
```bash
# Find your installation path
pwd

# Find your node path (if Claude Desktop can't find node)
which node

# Example with full node path:
{
  "mcpServers": {
    "fronius-solar": {
      "command": "/usr/local/bin/node",
      "args": ["/Users/yourname/fronius-mcp-server/dist/server.js"],
      "env": {
        "FRONIUS_HOST": "fronius-inverter.local"
      }
    }
  }
}
```

### 2. 🔐 Network Permissions (macOS)

**Claude Desktop requires access to the local network** to communicate with the Fronius inverter.

**How to enable permissions:**

1. **System Settings** → **Privacy & Security** → **Network**
2. Find **Claude** in the app list
3. ✅ Enable **Network access** for Claude Desktop
4. **Completely restart Claude Desktop**

**With macOS Firewall enabled, additionally:**
1. **System Settings** → **Network** → **Firewall** → **Options**
2. Add **Claude Desktop** to exceptions list or create rule

### 3. Start and Test

**After configuration:**
1. ⚠️ **Completely quit Claude Desktop** and restart
2. **Start new conversation**
3. **Test** with: \"How much power is my solar system currently producing?\"

## Development & Testing

### Development Mode
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing & Debugging
```bash
# Full connection test
npm run test-connection

# Linting & Type Checking
npm run lint
npm run typecheck
```

## MCP Resources

The server provides these resources:

- `fronius://api/version` - API Version
- `fronius://system/status` - System Status
- `fronius://system/led` - LED Status
- `fronius://inverter/info` - Inverter Information
- `fronius://inverter/realtime` - Inverter Real-time Data
- `fronius://meter/realtime` - Smart Meter Data
- `fronius://powerflow/realtime` - Power Flow Data
- `fronius://sensors/realtime` - Sensor Data
- `fronius://strings/realtime` - String Data
- `fronius://storage/realtime` - Battery Storage Data
- `fronius://ohmpilot/realtime` - OhmPilot Data
- `fronius://devices/active` - Active Devices

## MCP Tools

Available tools for interactive queries:

- `get_api_version` - Get API version
- `get_system_status` - Get system status
- `get_logger_led_info` - Get LED status
- `get_inverter_info` - Get inverter information
- `get_inverter_realtime` - Get inverter real-time data
- `get_meter_realtime` - Get smart meter data
- `get_powerflow_realtime` - Get power flow data
- `get_archive_data` - Get historical data
- `get_sensor_realtime` - Get sensor data
- `get_string_realtime` - Get string data
- `get_storage_realtime` - Get battery storage data
- `get_ohmpilot_realtime` - Get OhmPilot data
- `get_active_devices` - Get active devices
- `test_connection` - Test connection

### Tool Parameter Examples

**Query specific inverter:**
```json
{
  "name": "get_inverter_realtime",
  "arguments": {
    "deviceId": 1,
    "dataCollection": "CommonInverterData"
  }
}
```

**Get archive data:**
```json
{
  "name": "get_archive_data",
  "arguments": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "channel": "EnergyReal_WAC_Sum_Produced"
  }
}
```

**Get battery storage data:**
```json
{
  "name": "get_storage_realtime",
  "arguments": {
    "deviceId": 0
  }
}
```

**Get OhmPilot heating data:**
```json
{
  "name": "get_ohmpilot_realtime",
  "arguments": {
    "deviceId": 0
  }
}
```

## Troubleshooting

### Connection Issues

1. **Check hostname/IP:**
   ```bash
   ping fronius-inverter.local
   # or
   ping 192.168.1.100
   ```

2. **Test API access:**
   ```bash
   curl \"http://fronius-inverter.local/solar_api/GetAPIVersion.cgi\"
   ```

3. **Fronius Solar API enabled?**
   - In Fronius web interface: **System** → **Hardware** → **Datamanager**
   - **Solar API** must be enabled

4. **Claude Desktop Network Permissions (macOS):**
   - **System Settings** → **Privacy & Security** → **Network**
   - Allow Claude Desktop **network access**

5. **Firewall/Router:**
   - Port 80/443 must be accessible
   - No firewall blocking between Claude Desktop and Fronius

### Debugging

**Enable debug logging:**
```bash
LOG_LEVEL=debug npm run dev
```

**Test API endpoints systematically:**
```bash
FRONIUS_HOST=fronius-inverter.local npm run debug-fronius
```

**Connection test:**
```bash
FRONIUS_HOST=fronius-inverter.local npm run test-connection
```

## Compatibility

### Unsupported Features
- Some older Fronius devices don't support all API endpoints
- Archive data is not available on all models

## Architecture

```
src/
├── types/           # TypeScript definitions
│   ├── fronius.ts   # Fronius API response types
│   └── config.ts    # Configuration types
├── services/        # Business logic
│   ├── fronius-api.ts  # Fronius API client with retry logic
│   └── config.ts    # Configuration service
├── handlers/        # MCP request handlers
│   ├── resources.ts # Resource-based data access
│   └── tools.ts     # Tool-based interactions
└── server.ts        # Main server with lifecycle management
```

## Release Process

This project uses centralized version management - the version in `package.json` is the single source of truth for all components (MCP server config, User-Agent headers, etc.).

### Creating a Release

**1. Update Version**
```bash
# Bump version in package.json (patch/minor/major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0  
npm version major  # 1.1.0 -> 2.0.0
```

**2. Build and Test**
```bash
# Verify everything builds and tests pass
npm run build
npm run typecheck
npm run lint
npm run test-connection  # If Fronius device available
```

**3. Create Git Tag and Release**
```bash
# The npm version command automatically creates a git tag
# Push the tag to trigger GitHub Actions release workflow
git push origin main --tags
```

**4. GitHub Actions will automatically:**
- ✅ Run full test suite on multiple Node.js versions
- ✅ Build and test Docker image
- ✅ Create GitHub release with changelog
- ✅ Build and push multi-platform Docker images to Docker Hub
- ✅ Create release archives (.tar.gz and .zip)

**5. Docker Hub Update**
Once the GitHub release is published, users can update to the latest version:
```bash
docker pull dirkhuber/fronius-mcp-server:latest
# or specific version
docker pull dirkhuber/fronius-mcp-server:v1.0.1
```

### Version Management

The version is centrally managed in `package.json` and automatically used by:
- **MCP Server Config** (`src/services/config.ts`) - Server name and version
- **HTTP User-Agent** (`src/services/fronius-api.ts`) - API client identification
- **Docker Tags** (`.github/workflows/ci.yml`) - Container versioning
- **Release Assets** (GitHub Actions) - Archive naming

### Versioning Strategy

- **Patch (1.0.0 → 1.0.1)**: Bug fixes, small improvements
- **Minor (1.0.0 → 1.1.0)**: New features, API additions, non-breaking changes  
- **Major (1.0.0 → 2.0.0)**: Breaking changes, API changes, major refactoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **GitHub Issues**: For bugs and feature requests
- **Fronius API Documentation**: [Official Fronius Solar API](https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.fronius.com/~/downloads/Solar%2520Energy/Operating%2520Instructions/42,0410,2012.pdf&ved=2ahUKEwiomufK86GPAxXgQ_EDHRA-DBIQFnoECAkQAQ&usg=AOvVaw0mxq8LIp67POsxbZidwQQI)
- **MCP Protocol**: [Model Context Protocol Spec](https://github.com/modelcontextprotocol)
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development mode**: `npm run dev` (uses tsx with hot reload)
- **Build**: `npm run build` (compiles TypeScript to dist/)
- **Start production**: `npm start` (runs compiled JavaScript)
- **Install dependencies**: `npm install`
- **Lint**: `npm run lint` (ESLint 9.x with flat config)
- **Type check**: `npm run typecheck` (TypeScript compiler check)
- **Test connection**: `npm run test-connection` (full API connectivity test)
- **Docker build**: `npm run docker:build` (build Docker image locally)
- **Docker compose**: `docker-compose up -d` (run with docker-compose)

## Architecture Overview

This is a TypeScript-based Model Context Protocol (MCP) server that provides comprehensive access to Fronius solar inverter data. The application uses a modular architecture with proper separation of concerns and is designed for Claude Desktop integration.

### Project Structure

```
src/
├── types/           # TypeScript type definitions
│   ├── fronius.ts   # Complete Fronius API response types
│   └── config.ts    # Configuration interfaces
├── services/        # Business logic services
│   ├── fronius-api.ts  # Full Fronius API client with retry logic
│   └── config.ts    # Configuration management and validation
├── handlers/        # MCP protocol handlers
│   ├── resources.ts # Resource-based data access
│   └── tools.ts     # Tool-based interactive access
├── utils/           # Utility functions
│   └── version.ts   # Centralized version management
└── server.ts        # Main server with error handling and lifecycle
```

### Core Components

**FroniusAPIClient** (`src/services/fronius-api.ts`)
- Complete TypeScript implementation of Fronius Solar API v1
- Supports all major endpoints including GetStorageRealtimeData and GetOhmPilotRealtimeData
- **No fallback values** - proper error handling so LLM understands failures
- Configurable timeouts, retry counts, and connection parameters
- Built-in connection testing and health checks
- Uses centralized User-Agent from version utility

**Configuration Management** (`src/services/config.ts`)
- Environment variable-based configuration with validation
- **Centralized version management** - reads from package.json
- Support for multiple deployment scenarios (local hostname, IP, HTTPS)
- Default values and comprehensive error checking

**Version Management** (`src/utils/version.ts`)
- **Single source of truth** for project version (package.json)
- Provides getVersion(), getName(), getUserAgent() functions
- Used by MCP server config and HTTP User-Agent headers
- Fallback handling if package.json cannot be read

**MCP Handlers** (`src/handlers/`)
- **ResourceHandler**: Provides 11+ resource URIs for different data types
- **ToolHandler**: Implements 13+ interactive tools with parameter validation
- **MCP SDK 1.17.4** with explicit capabilities configuration
- Consistent error handling and response formatting

### Supported Fronius API Endpoints

**Complete API Coverage:**
- `GetAPIVersion.cgi` - API version information (direct JSON format)
- `v1/GetLoggerInfo.cgi` - System status and logger info
- `v1/GetLoggerLEDInfo.cgi` - LED status indicators
- `v1/GetInverterInfo.cgi` - Static inverter information
- `v1/GetInverterRealtimeData.cgi` - Real-time inverter data (multiple DataCollections)
- `v1/GetMeterRealtimeData.cgi` - Smart meter measurements
- `v1/GetPowerFlowRealtimeData.fcgi` - Energy flow visualization data
- `v1/GetArchiveData.cgi` - Historical data with flexible date ranges
- `v1/GetSensorRealtimeData.cgi` - Environmental sensor data
- `v1/GetStringRealtimeData.cgi` - DC string measurements
- `v1/GetStorageRealtimeData.cgi` - Battery storage system data (NEW)
- `v1/GetOhmPilotRealtimeData.cgi` - OhmPilot heating element data (NEW)
- `v1/GetActiveDeviceInfo.cgi` - Active device discovery

### Configuration

**Environment Variables** (see `.env.example`):
- `FRONIUS_HOST` - Device hostname/IP (default: fronius-inverter)
- `FRONIUS_PORT` - API port (default: 80)
- `FRONIUS_PROTOCOL` - http/https protocol selection
- `FRONIUS_TIMEOUT` - Request timeout (default: 10000ms)
- `FRONIUS_DEVICE_ID` - Default device ID for inverter calls
- `FRONIUS_RETRIES` - Number of retry attempts (default: 3)
- `FRONIUS_RETRY_DELAY` - Delay between retries (default: 1000ms)
- `LOG_LEVEL` - Logging level (error/warn/info/debug)

### API Architecture Notes

**Unique Fronius API Behavior:**
- Base URL: `/solar_api` (not `/solar_api/v1`)
- `GetAPIVersion.cgi` returns direct JSON (no Body/Head wrapper)
- All other endpoints use standard Fronius format with Body/Head structure
- Some endpoints may not be available on all devices (graceful fallbacks implemented)

### Error Handling & Reliability

- **Comprehensive retry logic** for network failures and timeouts
- **Connection testing** on startup and via tools
- **Graceful fallbacks** for unsupported API endpoints
- **Structured error responses** with timestamps and context
- **TypeScript safety** prevents runtime type errors
- **Input validation** for all tool parameters

## Docker Integration

**Recommended Deployment Method:**

The project now supports comprehensive Docker integration:

**Pre-built Docker Images:**
- Available on Docker Hub: `dirkhuber/fronius-mcp-server:latest`
- Multi-platform support (AMD64, ARM64)
- Automatic builds via GitHub Actions on releases

**Claude Desktop Docker Configuration:**
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

**Docker Features:**
- **Automatic lifecycle**: Container starts/stops with Claude Desktop sessions
- **No Node.js required**: Complete isolation from host system
- **Environment variables**: Passed via `-e` parameters in args
- **Auto-cleanup**: `--rm` flag removes container after use

### Claude Desktop Integration

**Three Installation Options:**

1. **Docker (Recommended)**: Use pre-built image from Docker Hub
2. **Local Build**: Build Docker image locally
3. **Native Process**: Direct Node.js execution

**Critical Requirements:**
- **Network Permissions**: Claude Desktop needs explicit network access on macOS
- **Fronius Solar API**: Must be enabled in inverter web interface
- **Full paths**: Use absolute paths for native process mode

**Network Permissions (macOS):**
- System Settings → Privacy & Security → Network  
- Enable network access for Claude Desktop
- Restart Claude Desktop after permission change

## Release Management

**Centralized Version Control:**
- Single source of truth: `package.json` version field
- Automatic propagation to MCP server config and HTTP User-Agent headers
- `src/utils/version.ts` provides centralized version functions

**Release Process:**
```bash
npm version patch    # 1.0.0 → 1.0.1 (automatically creates git tag)
git push origin main --tags   # Triggers full CI/CD pipeline
```

**GitHub Actions CI/CD:**
- **Multi-Node.js testing**: Tests on Node.js 20, 22, 24
- **Docker build & push**: Automatic multi-platform images to Docker Hub
- **GitHub Releases**: Auto-created with release notes and assets
- **Docker Hub sync**: README automatically updated on Docker Hub

### Development Notes

- **TypeScript 5.9.2** with ES modules configuration
- **ESLint 9.x** with flat configuration (migrated from .eslintrc.json)
- **MCP SDK 1.17.4** with breaking changes from 0.4.0 (explicit capabilities)
- Hot reload development mode with tsx
- All Fronius API responses are fully typed
- **No fallback values** - proper error propagation for LLM understanding
- Configuration validation prevents common deployment issues

### Testing Strategy

- `npm run test-connection` - Full connection and functionality test
- Connection test runs automatically on server startup
- **Proper error handling** - no graceful fallbacks, LLM gets real failure info
- Docker integration testing in CI pipeline

### Common Issues

1. **Network connectivity**: EHOSTUNREACH errors indicate network/permissions issues
2. **Fronius Solar API disabled**: Must be enabled in inverter web interface
3. **API endpoint support**: Not all Fronius devices support all endpoints
4. **JSON parsing**: GetAPIVersion.cgi has different response format than other endpoints
5. **macOS permissions**: Claude Desktop network access must be explicitly granted
6. **MCP SDK updates**: Version 1.17.4 requires explicit capabilities configuration
7. **Docker Hub permissions**: Requires Access Token (not password) for automated pushes
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development mode**: `npm run dev` (uses tsx with hot reload)
- **Build**: `npm run build` (compiles TypeScript to dist/)
- **Start production**: `npm start` (runs compiled JavaScript)
- **Install dependencies**: `npm install`
- **Lint**: `npm run lint` (ESLint with TypeScript rules)
- **Type check**: `npm run typecheck` (TypeScript compiler check)
- **Clean build**: `npm run clean` (removes dist/ folder)
- **Debug Fronius API**: `npm run debug-fronius` (test all API endpoints)
- **Test connection**: `npm run test-connection` (full API connectivity test)

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
└── server.ts        # Main server with error handling and lifecycle
```

### Core Components

**FroniusAPIClient** (`src/services/fronius-api.ts`)
- Complete TypeScript implementation of Fronius Solar API v1
- Supports all major endpoints with proper error handling and graceful fallbacks
- Configurable timeouts, retry counts, and connection parameters
- Built-in connection testing and health checks
- Special handling for GetAPIVersion.cgi (returns direct JSON, not wrapped)

**Configuration Management** (`src/services/config.ts`)
- Environment variable-based configuration with validation
- Support for multiple deployment scenarios (local hostname, IP, HTTPS)
- Default values and comprehensive error checking

**MCP Handlers** (`src/handlers/`)
- **ResourceHandler**: Provides 10+ resource URIs for different data types
- **ToolHandler**: Implements 12 interactive tools with parameter validation
- Consistent error handling and response formatting

### Supported Fronius API Endpoints

**Complete API Coverage:**
- `GetAPIVersion.cgi` - API version information (direct JSON format)
- `v1/GetLoggerInfo.cgi` - System status and logger info (with fallback)
- `v1/GetLoggerLEDInfo.cgi` - LED status indicators (with fallback)
- `v1/GetInverterInfo.cgi` - Static inverter information
- `v1/GetInverterRealtimeData.cgi` - Real-time inverter data (multiple DataCollections)
- `v1/GetMeterRealtimeData.cgi` - Smart meter measurements
- `v1/GetPowerFlowRealtimeData.fcgi` - Energy flow visualization data
- `v1/GetArchiveData.cgi` - Historical data with flexible date ranges (with fallback)
- `v1/GetSensorRealtimeData.cgi` - Environmental sensor data (with fallback)
- `v1/GetStringRealtimeData.cgi` - DC string measurements (with fallback)
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

### Claude Desktop Integration

**Critical Requirements:**
- **Network Permissions**: Claude Desktop needs explicit network access on macOS
- **Full path to executables**: Use absolute paths in MCP configuration
- **Environment variables**: Passed through MCP configuration

**Network Permissions (macOS):**
- System Settings → Privacy & Security → Network
- Enable network access for Claude Desktop
- Restart Claude Desktop after permission change

### Development Notes

- Uses ES modules with proper TypeScript configuration
- ESLint configured for TypeScript with strict rules
- Hot reload development mode with tsx
- All Fronius API responses are fully typed
- Configuration validation prevents common deployment issues
- Graceful degradation when API endpoints are not supported by device

### Testing Strategy

- `npm run debug-fronius` - Tests all API endpoints systematically
- `npm run test-connection` - Full connection and functionality test
- Connection test runs automatically on server startup
- All unsupported endpoints fail gracefully with fallback data

### Common Issues

1. **Network connectivity**: EHOSTUNREACH errors indicate network/permissions issues
2. **API endpoint support**: Not all Fronius devices support all endpoints
3. **JSON parsing**: GetAPIVersion.cgi has different response format than other endpoints
4. **macOS permissions**: Claude Desktop network access must be explicitly granted
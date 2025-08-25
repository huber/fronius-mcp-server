#!/usr/bin/env node

import { Command } from 'commander';
import { FroniusMCPServer } from './server.js';
import { getVersion, getName } from './utils/version.js';

const program = new Command();

// Configure command line interface
program
  .name('fronius-mcp-server')
  .description('MCP Server for Fronius Solar API - enables Claude Desktop access to solar inverter data')
  .version(getVersion());

program
  .option('-h, --host <host>', 'Fronius inverter hostname or IP address', process.env.FRONIUS_HOST || 'fronius-inverter')
  .option('-p, --port <port>', 'Fronius inverter port', process.env.FRONIUS_PORT || '80')
  .option('--protocol <protocol>', 'Protocol (http|https)', process.env.FRONIUS_PROTOCOL || 'http')
  .option('-t, --timeout <timeout>', 'Request timeout in ms', process.env.FRONIUS_TIMEOUT || '10000')
  .option('-d, --device-id <deviceId>', 'Default device ID', process.env.FRONIUS_DEVICE_ID || '1')
  .option('-r, --retries <retries>', 'Number of retry attempts', process.env.FRONIUS_RETRIES || '3')
  .option('--retry-delay <delay>', 'Delay between retries in ms', process.env.FRONIUS_RETRY_DELAY || '1000')
  .option('-l, --log-level <level>', 'Log level (error|warn|info|debug)', process.env.LOG_LEVEL || 'info')
  .option('--test-connection', 'Test connection and exit')
  .option('--stdio', 'Use stdio transport (default for MCP)');

program.action(async (options) => {
  try {
    // Note: --version is automatically handled by commander.js

    // Set environment variables from CLI options
    if (options.host) process.env.FRONIUS_HOST = options.host;
    if (options.port) process.env.FRONIUS_PORT = options.port.toString();
    if (options.protocol) process.env.FRONIUS_PROTOCOL = options.protocol;
    if (options.timeout) process.env.FRONIUS_TIMEOUT = options.timeout.toString();
    if (options.deviceId) process.env.FRONIUS_DEVICE_ID = options.deviceId.toString();
    if (options.retries) process.env.FRONIUS_RETRIES = options.retries.toString();
    if (options.retryDelay) process.env.FRONIUS_RETRY_DELAY = options.retryDelay.toString();
    if (options.logLevel) process.env.LOG_LEVEL = options.logLevel;

    // Validate protocol
    if (options.protocol && !['http', 'https'].includes(options.protocol)) {
      console.error('❌ Protocol must be either "http" or "https"');
      process.exit(1);
    }

    // Validate log level
    if (options.logLevel && !['error', 'warn', 'info', 'debug'].includes(options.logLevel)) {
      console.error('❌ Log level must be one of: error, warn, info, debug');
      process.exit(1);
    }

    // Test connection mode
    if (options.testConnection) {
      console.log('🔍 Testing connection to Fronius inverter...');
      const { testConnection } = await import('./test-connection.js');
      await testConnection();
      process.exit(0);
    }

    // Show startup information
    if (process.env.LOG_LEVEL === 'info' || process.env.LOG_LEVEL === 'debug') {
      console.error(`🌞 ${getName()} v${getVersion()}`);
      console.error(`📡 Connecting to: ${options.protocol}://${options.host}:${options.port}`);
      console.error(`🔧 Device ID: ${options.deviceId}, Timeout: ${options.timeout}ms`);
      console.error(`📝 Log Level: ${options.logLevel}`);
      console.error('');
    }

    // Start MCP server
    const server = new FroniusMCPServer();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.error('\n🛑 Shutting down...');
      server.close();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('\n🛑 Shutting down...');
      server.close();
      process.exit(0);
    });

    // Start the server
    await server.run();

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
});

// Help examples
program.addHelpText('after', `
Examples:
  $ fronius-mcp-server --host fronius-inverter.local
  $ fronius-mcp-server --host 192.168.1.100 --port 80
  $ fronius-mcp-server --host 192.168.1.100 --protocol https --port 443
  $ fronius-mcp-server --test-connection
  $ fronius-mcp-server --log-level debug

Claude Desktop Configuration:
  {
    "mcpServers": {
      "fronius-solar": {
        "command": "fronius-mcp-server",
        "args": ["--host", "fronius-inverter.local"],
        "env": {}
      }
    }
  }

Environment Variables:
  FRONIUS_HOST              Fronius inverter hostname/IP
  FRONIUS_PORT              Fronius inverter port (default: 80)
  FRONIUS_PROTOCOL          Protocol http|https (default: http)
  FRONIUS_TIMEOUT           Request timeout in ms (default: 10000)
  FRONIUS_DEVICE_ID         Default device ID (default: 1)
  FRONIUS_RETRIES           Retry attempts (default: 3)
  FRONIUS_RETRY_DELAY       Retry delay in ms (default: 1000)
  LOG_LEVEL                 Log level (default: info)
`);

// Parse command line arguments
program.parse();
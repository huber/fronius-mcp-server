#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { FroniusAPIClient } from './services/fronius-api.js';
import { getDefaultConfig, validateConfig } from './services/config.js';
import { ResourceHandler } from './handlers/resources.js';
import { ToolHandler } from './handlers/tools.js';
import type { AppConfig } from './types/config.js';

export class FroniusMCPServer {
  private server: Server;
  private config: AppConfig;
  private apiClient: FroniusAPIClient;
  private resourceHandler: ResourceHandler;
  private toolHandler: ToolHandler;

  constructor() {
    this.config = getDefaultConfig();
    this.validateConfiguration();
    
    this.server = new Server(
      {
        name: this.config.mcp.name,
        version: this.config.mcp.version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.apiClient = new FroniusAPIClient(this.config.fronius);
    this.resourceHandler = new ResourceHandler(this.apiClient);
    this.toolHandler = new ToolHandler(this.apiClient);

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private validateConfiguration(): void {
    const errors = validateConfig(this.config);
    if (errors.length > 0) {
      console.error('[CONFIG] Configuration errors:');
      errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }
    
    console.error(`[CONFIG] Fronius host: ${this.config.fronius.host}:${this.config.fronius.port}`);
    console.error(`[CONFIG] Protocol: ${this.config.fronius.protocol}`);
    console.error(`[CONFIG] Timeout: ${this.config.fronius.timeout}ms`);
  }

  private setupHandlers(): void {
    // Resource handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      console.error('[MCP] Listing resources');
      return await this.resourceHandler.listResources();
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      console.error(`[MCP] Reading resource: ${request.params.uri}`);
      return await this.resourceHandler.readResource(request);
    });

    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.error('[MCP] Listing tools');
      return await this.toolHandler.listTools();
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.error(`[MCP] Calling tool: ${request.params.name}`);
      return await this.toolHandler.callTool(request);
    });
  }

  private setupErrorHandling(): void {
    process.on('SIGINT', () => {
      console.error('[SERVER] Received SIGINT, shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.error('[SERVER] Received SIGTERM, shutting down gracefully');
      process.exit(0);
    });

    process.on('uncaughtException', (error) => {
      console.error('[SERVER] Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[SERVER] Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  async run(): Promise<void> {
    try {
      console.error('[SERVER] Starting Fronius MCP Server...');
      
      // Test connection on startup
      console.error('[SERVER] Testing Fronius connection...');
      const isConnected = await this.apiClient.testConnection();
      
      if (!isConnected) {
        console.error('[SERVER] Warning: Initial connection test failed. Server will start but may not function correctly.');
        console.error('[SERVER] Please verify:');
        console.error(`[SERVER]   - Fronius device is reachable at ${this.config.fronius.protocol}://${this.config.fronius.host}:${this.config.fronius.port}`);
        console.error('[SERVER]   - Device has Solar API enabled');
        console.error('[SERVER]   - Network connectivity is working');
      } else {
        console.error('[SERVER] ✓ Fronius connection test successful');
      }

      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.error(`[SERVER] Fronius MCP Server is running!`);
      console.error(`[SERVER] Configuration:`);
      console.error(`[SERVER]   - Host: ${this.config.fronius.host}:${this.config.fronius.port}`);
      console.error(`[SERVER]   - Protocol: ${this.config.fronius.protocol}`);
      console.error(`[SERVER]   - Default Device ID: ${this.config.fronius.defaultDeviceId}`);
      console.error(`[SERVER]   - Timeout: ${this.config.fronius.timeout}ms`);
      console.error(`[SERVER]   - Retries: ${this.config.fronius.retries}`);

    } catch (error) {
      console.error('[SERVER] Failed to start server:', error);
      process.exit(1);
    }
  }

  close(): void {
    // Graceful shutdown - could add cleanup logic here if needed
    if (this.config.logLevel === 'debug' || this.config.logLevel === 'info') {
      console.error('[SERVER] Shutting down MCP server...');
    }
  }
}

// Only start server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Environment variables documentation
  const envHelp = `
Environment Variables:
  FRONIUS_HOST          Fronius device hostname or IP (default: fronius-inverter)
  FRONIUS_PORT          Fronius device port (default: 80)
  FRONIUS_PROTOCOL      Protocol to use: http or https (default: http)
  FRONIUS_TIMEOUT       Request timeout in milliseconds (default: 10000)
  FRONIUS_DEVICE_ID     Default device ID for inverter calls (default: 1)
  FRONIUS_RETRIES       Number of retry attempts (default: 3)
  FRONIUS_RETRY_DELAY   Delay between retries in milliseconds (default: 1000)
  LOG_LEVEL            Log level: error, warn, info, debug (default: info)

Example:
  FRONIUS_HOST=fronius-inverter.local FRONIUS_PROTOCOL=https npm start
`;

  // Show help if requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(envHelp);
    process.exit(0);
  }

  // Start the server
  const server = new FroniusMCPServer();
  server.run().catch((error) => {
    console.error('[SERVER] Fatal error:', error);
    process.exit(1);
  });
}
/**
 * Fronius MCP Server - Public API Exports
 * 
 * This file defines the public API for the npm package, allowing users
 * to import and use the Fronius MCP Server programmatically.
 */

// Main server class
export { FroniusMCPServer } from './server.js';

// API client for direct Fronius API access
export { FroniusAPIClient } from './services/fronius-api.js';

// Configuration utilities
export { getDefaultConfig, validateConfig } from './services/config.js';

// Version utilities
export { getVersion, getName, getUserAgent } from './utils/version.js';

// Type definitions for TypeScript users
export type {
  // Configuration types
  AppConfig,
  FroniusConfig,
  MCPConfig
} from './types/config.js';

export type {
  // Core Fronius API types
  FroniusAPIResponse,
  APIVersion,
  SystemStatus,
  LoggerLEDInfo,
  ActiveDeviceInfo,
  
  // Inverter types
  InverterInfo,
  InverterRealtimeData,
  
  // Meter and power flow types
  MeterRealtimeData,
  PowerFlowRealtimeData,
  
  // Storage and smart home types
  StorageRealtimeData,
  OhmPilotRealtimeData,
  
  // Additional data types
  ArchiveData,
  SensorRealtimeData,
  StringRealtimeData
} from './types/fronius.js';

// Re-export MCP types for convenience
export type {
  Resource,
  Tool,
  TextContent,
  ImageContent
} from '@modelcontextprotocol/sdk/types.js';
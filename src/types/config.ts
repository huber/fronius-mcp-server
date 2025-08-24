export interface FroniusConfig {
  host: string;
  port?: number;
  protocol?: 'http' | 'https';
  timeout?: number;
  defaultDeviceId?: number;
  retries?: number;
  retryDelay?: number;
}

export interface MCPConfig {
  name: string;
  version: string;
}

export interface AppConfig {
  fronius: FroniusConfig;
  mcp: MCPConfig;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}
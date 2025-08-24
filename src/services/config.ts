import type { AppConfig } from '../types/config.js';
import { getName, getVersion } from '../utils/version.js';

export function getDefaultConfig(): AppConfig {
  return {
    fronius: {
      host: process.env.FRONIUS_HOST || 'fronius-inverter',
      port: parseInt(process.env.FRONIUS_PORT || '80'),
      protocol: (process.env.FRONIUS_PROTOCOL as 'http' | 'https') || 'http',
      timeout: parseInt(process.env.FRONIUS_TIMEOUT || '10000'),
      defaultDeviceId: parseInt(process.env.FRONIUS_DEVICE_ID || '1'),
      retries: parseInt(process.env.FRONIUS_RETRIES || '3'),
      retryDelay: parseInt(process.env.FRONIUS_RETRY_DELAY || '1000')
    },
    mcp: {
      name: getName(),
      version: getVersion()
    },
    logLevel: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info'
  };
}

export function validateConfig(config: AppConfig): string[] {
  const errors: string[] = [];
  
  if (!config.fronius.host) {
    errors.push('Fronius host is required');
  }
  
  if (config.fronius.port && (config.fronius.port < 1 || config.fronius.port > 65535)) {
    errors.push('Fronius port must be between 1 and 65535');
  }
  
  if (config.fronius.timeout && config.fronius.timeout < 1000) {
    errors.push('Fronius timeout must be at least 1000ms');
  }
  
  if (config.fronius.defaultDeviceId && config.fronius.defaultDeviceId < 1) {
    errors.push('Fronius device ID must be positive');
  }
  
  return errors;
}
#!/usr/bin/env node

/**
 * Connection Test Utility
 * 
 * Tests the connection to a Fronius inverter and validates the Solar API.
 * Can be used standalone or imported by other modules.
 */

import { FroniusAPIClient } from './services/fronius-api.js';
import { getDefaultConfig } from './services/config.js';

export async function testConnection(): Promise<void> {
  const config = getDefaultConfig();
  const client = new FroniusAPIClient(config.fronius);

  console.log(`🔍 Testing connection to: ${config.fronius.protocol}://${config.fronius.host}:${config.fronius.port}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Test API Version
    console.log('📡 Testing API Version...');
    const apiVersion = await client.getAPIVersion();
    console.log(`   ✅ API Version: ${apiVersion.APIVersion}`);
    console.log(`   ✅ Base URL: ${apiVersion.BaseURL}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Connection test completed successfully!');

  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  testConnection().catch(() => {
    process.exit(1);
  });
}
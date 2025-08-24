#!/usr/bin/env node

// Standalone test script to verify Fronius connection
import { FroniusAPIClient } from './services/fronius-api.js';
import { getDefaultConfig } from './services/config.js';

async function testConnection(): Promise<void> {
  const config = getDefaultConfig();
  console.log(`Testing connection to: ${config.fronius.protocol}://${config.fronius.host}:${config.fronius.port}`);
  
  const client = new FroniusAPIClient(config.fronius);
  
  try {
    console.log('\n1. Testing API Version...');
    const version = await client.getAPIVersion();
    console.log('✅ API Version:', version);
    
    console.log('\n2. Testing System Status...');
    const status = await client.getSystemStatus();
    console.log('✅ System Status:', JSON.stringify(status, null, 2));
    
    console.log('\n3. Testing Inverter Info...');
    const inverterInfo = await client.getInverterInfo();
    console.log('✅ Inverter Info:', JSON.stringify(inverterInfo, null, 2));
    
    console.log('\n4. Testing Power Flow...');
    const powerFlow = await client.getPowerFlowRealtimeData();
    console.log('✅ Power Flow:', JSON.stringify(powerFlow, null, 2));
    
    console.log('\n🎉 All tests successful! MCP Server should work in Claude Desktop.');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error instanceof Error ? error.message : error);
    console.error('\nPlease check:');
    console.error('- Fronius device IP/hostname is correct');
    console.error('- Device is on the same network');
    console.error('- Solar API is enabled on the device');
    console.error('- No firewall blocking the connection');
    console.error('\nYou can try:');
    console.error(`curl "http://${config.fronius.host}/solar_api/GetAPIVersion.cgi"`);
  }
}

testConnection().catch(console.error);
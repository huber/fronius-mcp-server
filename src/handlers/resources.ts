import type {
  Resource
} from '@modelcontextprotocol/sdk/types.js';
import type { FroniusAPIClient } from '../services/fronius-api.js';

export class ResourceHandler {
  constructor(private apiClient: FroniusAPIClient) {}

  async listResources(): Promise<{ resources: Resource[] }> {
    return {
      resources: [
        {
          uri: 'fronius://api/version',
          mimeType: 'application/json',
          name: 'API Version',
          description: 'Fronius Solar API version information'
        },
        {
          uri: 'fronius://system/status',
          mimeType: 'application/json',
          name: 'System Status',
          description: 'Logger and system information'
        },
        {
          uri: 'fronius://system/led',
          mimeType: 'application/json',
          name: 'LED Status',
          description: 'Logger LED status information'
        },
        {
          uri: 'fronius://inverter/info',
          mimeType: 'application/json',
          name: 'Inverter Information',
          description: 'Static inverter information'
        },
        {
          uri: 'fronius://inverter/realtime',
          mimeType: 'application/json',
          name: 'Inverter Realtime Data',
          description: 'Current inverter measurements and status'
        },
        {
          uri: 'fronius://meter/realtime',
          mimeType: 'application/json',
          name: 'Smart Meter Realtime Data',
          description: 'Current smart meter measurements'
        },
        {
          uri: 'fronius://powerflow/realtime',
          mimeType: 'application/json',
          name: 'Power Flow Realtime Data',
          description: 'Energy flow data showing production, consumption, and grid interaction'
        },
        {
          uri: 'fronius://sensors/realtime',
          mimeType: 'application/json',
          name: 'Sensor Realtime Data',
          description: 'Environmental sensor data (temperature, irradiance, etc.)'
        },
        {
          uri: 'fronius://strings/realtime',
          mimeType: 'application/json',
          name: 'String Realtime Data',
          description: 'DC string voltage and current measurements'
        },
        {
          uri: 'fronius://storage/realtime',
          mimeType: 'application/json',
          name: 'Storage Realtime Data',
          description: 'Battery storage system data including state of charge, power, and temperature'
        },
        {
          uri: 'fronius://ohmpilot/realtime',
          mimeType: 'application/json',
          name: 'OhmPilot Realtime Data',
          description: 'Smart heating element controller data including power consumption and temperature'
        },
        {
          uri: 'fronius://devices/active',
          mimeType: 'application/json',
          name: 'Active Devices',
          description: 'List of active devices in the system'
        }
      ]
    };
  }

  async readResource(request: { params: { uri: string } }): Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }> {
    const { uri } = request.params;
    
    try {
      let data: unknown;
      
      switch (uri) {
        case 'fronius://api/version':
          data = await this.apiClient.getAPIVersion();
          break;
          
        case 'fronius://system/status':
          data = await this.apiClient.getSystemStatus();
          break;
          
        case 'fronius://system/led':
          data = await this.apiClient.getLoggerLEDInfo();
          break;
          
        case 'fronius://inverter/info':
          data = await this.apiClient.getInverterInfo();
          break;
          
        case 'fronius://inverter/realtime':
          data = await this.apiClient.getInverterRealtimeData();
          break;
          
        case 'fronius://meter/realtime':
          data = await this.apiClient.getMeterRealtimeData();
          break;
          
        case 'fronius://powerflow/realtime':
          data = await this.apiClient.getPowerFlowRealtimeData();
          break;
          
        case 'fronius://sensors/realtime':
          data = await this.apiClient.getSensorRealtimeData();
          break;
          
        case 'fronius://strings/realtime':
          data = await this.apiClient.getStringRealtimeData();
          break;
          
        case 'fronius://storage/realtime':
          data = await this.apiClient.getStorageRealtimeData();
          break;
          
        case 'fronius://ohmpilot/realtime':
          data = await this.apiClient.getOhmPilotRealtimeData();
          break;
          
        case 'fronius://devices/active':
          data = await this.apiClient.getActiveDeviceInfo();
          break;
          
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify({ 
              error: errorMessage,
              timestamp: new Date().toISOString(),
              uri
            }, null, 2)
          }
        ]
      };
    }
  }
}
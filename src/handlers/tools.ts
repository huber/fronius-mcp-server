import type {
  Tool,
  TextContent
} from '@modelcontextprotocol/sdk/types.js';
import type { FroniusAPIClient } from '../services/fronius-api.js';

export class ToolHandler {
  constructor(private apiClient: FroniusAPIClient) {}

  async listTools(): Promise<{ tools: Tool[] }> {
    return {
      tools: [
        {
          name: 'get_api_version',
          description: 'Get Fronius Solar API version information',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'get_system_status',
          description: 'Get system status and logger information',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'get_logger_led_info',
          description: 'Get logger LED status information',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'get_inverter_info',
          description: 'Get static inverter information',
          inputSchema: {
            type: 'object',
            properties: {
              deviceId: {
                type: 'number',
                description: 'Specific device ID (optional, defaults to all devices)',
                minimum: 1
              }
            },
            required: []
          }
        },
        {
          name: 'get_inverter_realtime',
          description: 'Get real-time inverter data including power, energy, voltage, current',
          inputSchema: {
            type: 'object',
            properties: {
              deviceId: {
                type: 'number',
                description: 'Specific device ID (optional, defaults to system scope)',
                minimum: 1
              },
              dataCollection: {
                type: 'string',
                description: 'Data collection type',
                enum: ['CommonInverterData', 'CumulationInverterData', '3PInverterData', 'MinMaxInverterData'],
                default: 'CommonInverterData'
              }
            },
            required: []
          }
        },
        {
          name: 'get_meter_realtime',
          description: 'Get real-time smart meter data',
          inputSchema: {
            type: 'object',
            properties: {
              scope: {
                type: 'string',
                description: 'Data scope',
                enum: ['System', 'Device'],
                default: 'System'
              }
            },
            required: []
          }
        },
        {
          name: 'get_powerflow_realtime',
          description: 'Get real-time power flow data showing energy production, consumption, and grid interaction',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'get_archive_data',
          description: 'Get historical archive data for a specific time period',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$'
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$'
              },
              channel: {
                type: 'string',
                description: 'Data channel to retrieve',
                default: 'EnergyReal_WAC_Sum_Produced',
                enum: [
                  'EnergyReal_WAC_Sum_Produced',
                  'EnergyReal_WAC_Sum_Consumed',
                  'PowerReal_PAC_Sum',
                  'Current_AC_Phase_1',
                  'Voltage_AC_Phase_1',
                  'Temperature_Powerstage'
                ]
              },
              scope: {
                type: 'string',
                description: 'Data scope',
                enum: ['System', 'Device'],
                default: 'System'
              },
              deviceId: {
                type: 'number',
                description: 'Device ID (required when scope is Device)',
                minimum: 1
              }
            },
            required: ['startDate', 'endDate']
          }
        },
        {
          name: 'get_sensor_realtime',
          description: 'Get real-time sensor data (temperature, irradiance, wind, etc.)',
          inputSchema: {
            type: 'object',
            properties: {
              dataCollection: {
                type: 'string',
                description: 'Sensor data collection type',
                enum: ['NowSensorData', 'MinMaxSensorData'],
                default: 'NowSensorData'
              }
            },
            required: []
          }
        },
        {
          name: 'get_string_realtime',
          description: 'Get real-time DC string data (voltage and current per string)',
          inputSchema: {
            type: 'object',
            properties: {
              dataCollection: {
                type: 'string',
                description: 'String data collection type',
                enum: ['NowStringControlData', 'LastErrorStringControlData'],
                default: 'NowStringControlData'
              }
            },
            required: []
          }
        },
        {
          name: 'get_storage_realtime',
          description: 'Get real-time battery storage data (state of charge, power, temperature)',
          inputSchema: {
            type: 'object',
            properties: {
              deviceId: {
                type: 'number',
                description: 'Storage device ID (optional, defaults to system-wide data)'
              }
            },
            required: []
          }
        },
        {
          name: 'get_ohmpilot_realtime',
          description: 'Get real-time OhmPilot data (smart heating element controller power and temperature)',
          inputSchema: {
            type: 'object',
            properties: {
              deviceId: {
                type: 'number',
                description: 'OhmPilot device ID (optional, defaults to system-wide data)'
              }
            },
            required: []
          }
        },
        {
          name: 'get_active_devices',
          description: 'Get information about active devices in the system',
          inputSchema: {
            type: 'object',
            properties: {
              deviceClass: {
                type: 'string',
                description: 'Device class to query',
                enum: ['System', 'Inverter', 'Meter', 'Sensor', 'StringControl'],
                default: 'System'
              }
            },
            required: []
          }
        },
        {
          name: 'test_connection',
          description: 'Test the connection to the Fronius device',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ]
    };
  }

  async callTool(request: { params: { name: string; arguments?: Record<string, unknown> } }): Promise<{ content: TextContent[]; isError?: boolean }> {
    const { name, arguments: args = {} } = request.params;
    
    try {
      let data: unknown;
      let message: string;
      
      switch (name) {
        case 'get_api_version':
          data = await this.apiClient.getAPIVersion();
          message = 'API version information retrieved successfully';
          break;
          
        case 'get_system_status':
          data = await this.apiClient.getSystemStatus();
          message = 'System status retrieved successfully';
          break;
          
        case 'get_logger_led_info':
          data = await this.apiClient.getLoggerLEDInfo();
          message = 'Logger LED information retrieved successfully';
          break;
          
        case 'get_inverter_info':
          data = await this.apiClient.getInverterInfo(args.deviceId as number);
          message = 'Inverter information retrieved successfully';
          break;
          
        case 'get_inverter_realtime':
          data = await this.apiClient.getInverterRealtimeData(
            args.deviceId as number,
            (args.dataCollection as string) || 'CommonInverterData'
          );
          message = 'Inverter realtime data retrieved successfully';
          break;
          
        case 'get_meter_realtime':
          data = await this.apiClient.getMeterRealtimeData((args.scope as string) || 'System');
          message = 'Smart meter realtime data retrieved successfully';
          break;
          
        case 'get_powerflow_realtime':
          data = await this.apiClient.getPowerFlowRealtimeData();
          message = 'Power flow realtime data retrieved successfully';
          break;
          
        case 'get_archive_data':
          if (!args.startDate || !args.endDate) {
            throw new Error('startDate and endDate are required for archive data');
          }
          data = await this.apiClient.getArchiveData({
            startDate: args.startDate as string,
            endDate: args.endDate as string,
            channel: (args.channel as string) || 'EnergyReal_WAC_Sum_Produced',
            scope: (args.scope as string) || 'System',
            deviceId: args.deviceId as number
          });
          message = 'Archive data retrieved successfully';
          break;
          
        case 'get_sensor_realtime':
          data = await this.apiClient.getSensorRealtimeData((args.dataCollection as string) || 'NowSensorData');
          message = 'Sensor realtime data retrieved successfully';
          break;
          
        case 'get_string_realtime':
          data = await this.apiClient.getStringRealtimeData((args.dataCollection as string) || 'NowStringControlData');
          message = 'String realtime data retrieved successfully';
          break;
          
        case 'get_storage_realtime':
          data = await this.apiClient.getStorageRealtimeData(args.deviceId as number);
          message = 'Storage real-time data retrieved successfully';
          break;
          
        case 'get_ohmpilot_realtime':
          data = await this.apiClient.getOhmPilotRealtimeData(args.deviceId as number);
          message = 'OhmPilot real-time data retrieved successfully';
          break;
          
        case 'get_active_devices':
          data = await this.apiClient.getActiveDeviceInfo((args.deviceClass as string) || 'System');
          message = 'Active devices information retrieved successfully';
          break;
          
        case 'test_connection': {
          const isConnected = await this.apiClient.testConnection();
          data = { 
            connected: isConnected, 
            config: this.apiClient.getConfig(),
            timestamp: new Date().toISOString()
          };
          message = isConnected ? 'Connection test successful' : 'Connection test failed';
          break;
        }
          
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ message, data }, null, 2)
          }
        ]
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[TOOL] Error executing ${name}:`, errorMessage);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Error executing ${name}: ${errorMessage}`,
              timestamp: new Date().toISOString(),
              tool: name,
              arguments: args
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
}
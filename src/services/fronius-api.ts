import fetch from 'node-fetch';
import type { FroniusConfig } from '../types/config.js';
import type {
  FroniusAPIResponse,
  InverterRealtimeData,
  InverterInfo,
  MeterRealtimeData,
  PowerFlowRealtimeData,
  SystemStatus,
  ArchiveData,
  SensorRealtimeData,
  StringRealtimeData,
  StorageRealtimeData,
  OhmPilotRealtimeData,
  ActiveDeviceInfo,
  APIVersion,
  LoggerLEDInfo
} from '../types/fronius.js';
import { getUserAgent } from '../utils/version.js';

export class FroniusAPIClient {
  private config: FroniusConfig;
  private baseUrl: string;

  constructor(config: FroniusConfig) {
    this.config = {
      protocol: 'http',
      port: 80,
      timeout: 10000,
      defaultDeviceId: 1,
      retries: 3,
      retryDelay: 1000,
      ...config
    };
    
    const port = this.config.port !== 80 ? `:${this.config.port}` : '';
    this.baseUrl = `${this.config.protocol}://${this.config.host}${port}/solar_api`;
  }

  private async makeRequest<T>(endpoint: string, retries = 0): Promise<FroniusAPIResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    console.error(`[API] Request: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': getUserAgent()
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as FroniusAPIResponse<T>;
      
      // Check if Fronius API returned an error
      if (data.Head?.Status?.Code !== 0) {
        throw new Error(`Fronius API Error ${data.Head.Status.Code}: ${data.Head.Status.Reason} - ${data.Head.Status.UserMessage}`);
      }
      
      console.error(`[API] Success: ${url}`);
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[API] Error (attempt ${retries + 1}): ${errorMessage}`);
      
      // Retry logic
      if (retries < (this.config.retries ?? 3) && 
          (error instanceof Error && (error.name === 'AbortError' || errorMessage.includes('ENOTFOUND') || errorMessage.includes('ECONNREFUSED')))) {
        console.error(`[API] Retrying in ${this.config.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
        return this.makeRequest<T>(endpoint, retries + 1);
      }
      
      throw new Error(`Fronius API request failed: ${errorMessage}`);
    }
  }

  // Core API Methods
  
  async getAPIVersion(): Promise<APIVersion> {
    // Special case: GetAPIVersion.cgi returns direct JSON, not wrapped in Fronius format
    const url = `${this.baseUrl}/GetAPIVersion.cgi`;
    console.error(`[API] Request: ${url}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': getUserAgent()
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as APIVersion;
      console.error(`[API] Success: ${url}`);
      return data;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[API] Error: ${errorMessage}`);
      throw new Error(`Fronius API request failed: ${errorMessage}`);
    }
  }

  async getSystemStatus(): Promise<SystemStatus> {
    const response = await this.makeRequest<SystemStatus>('v1/GetLoggerInfo.cgi');
    return response.Body;
  }

  async getLoggerLEDInfo(): Promise<LoggerLEDInfo> {
    const response = await this.makeRequest<LoggerLEDInfo>('v1/GetLoggerLEDInfo.cgi');
    return response.Body;
  }

  // Inverter Methods
  
  async getInverterInfo(deviceId?: number): Promise<InverterInfo> {
    const endpoint = deviceId 
      ? `v1/GetInverterInfo.cgi?DeviceId=${deviceId}`
      : 'v1/GetInverterInfo.cgi';
    const response = await this.makeRequest<InverterInfo>(endpoint);
    return response.Body;
  }

  async getInverterRealtimeData(deviceId?: number, dataCollection = 'CommonInverterData'): Promise<InverterRealtimeData> {
    let endpoint = 'v1/GetInverterRealtimeData.cgi?';
    
    if (deviceId) {
      endpoint += `Scope=Device&DeviceId=${deviceId}&DataCollection=${dataCollection}`;
    } else {
      endpoint += `Scope=System&DataCollection=${dataCollection}`;
    }
    
    const response = await this.makeRequest<InverterRealtimeData>(endpoint);
    return response.Body;
  }

  // Meter Methods
  
  async getMeterRealtimeData(scope = 'System'): Promise<MeterRealtimeData> {
    const response = await this.makeRequest<MeterRealtimeData>(`v1/GetMeterRealtimeData.cgi?Scope=${scope}`);
    return response.Body;
  }

  // Power Flow Methods
  
  async getPowerFlowRealtimeData(): Promise<PowerFlowRealtimeData> {
    const response = await this.makeRequest<PowerFlowRealtimeData>('v1/GetPowerFlowRealtimeData.fcgi');
    return response.Body;
  }

  // Archive Methods
  
  async getArchiveData(options: {
    startDate: string;
    endDate: string;
    channel?: string;
    scope?: string;
    deviceId?: number;
  }): Promise<ArchiveData> {
    const {
      startDate,
      endDate,
      channel = 'EnergyReal_WAC_Sum_Produced',
      scope = 'System',
      deviceId
    } = options;
    
    let endpoint = `v1/GetArchiveData.cgi?Scope=${scope}&StartDate=${startDate}&EndDate=${endDate}&Channel=${channel}`;
    
    if (deviceId && scope === 'Device') {
      endpoint += `&DeviceId=${deviceId}`;
    }
    
    const response = await this.makeRequest<ArchiveData>(endpoint);
    return response.Body;
  }

  // Sensor Methods
  
  async getSensorRealtimeData(dataCollection = 'NowSensorData'): Promise<SensorRealtimeData> {
    const response = await this.makeRequest<SensorRealtimeData>(`v1/GetSensorRealtimeData.cgi?Scope=System&DataCollection=${dataCollection}`);
    return response.Body;
  }

  // String Methods
  
  async getStringRealtimeData(dataCollection = 'NowStringControlData'): Promise<StringRealtimeData> {
    const response = await this.makeRequest<StringRealtimeData>(`v1/GetStringRealtimeData.cgi?Scope=System&DataCollection=${dataCollection}`);
    return response.Body;
  }

  // Storage Methods
  
  async getStorageRealtimeData(deviceId?: number): Promise<StorageRealtimeData> {
    const endpoint = deviceId 
      ? `v1/GetStorageRealtimeData.cgi?Scope=Device&DeviceId=${deviceId}`
      : 'v1/GetStorageRealtimeData.cgi?Scope=System';
    const response = await this.makeRequest<StorageRealtimeData>(endpoint);
    return response.Body;
  }

  // OhmPilot Methods
  
  async getOhmPilotRealtimeData(deviceId?: number): Promise<OhmPilotRealtimeData> {
    const endpoint = deviceId 
      ? `v1/GetOhmPilotRealtimeData.cgi?Scope=Device&DeviceId=${deviceId}`
      : 'v1/GetOhmPilotRealtimeData.cgi?Scope=System';
    const response = await this.makeRequest<OhmPilotRealtimeData>(endpoint);
    return response.Body;
  }

  // Device Methods
  
  async getActiveDeviceInfo(deviceClass = 'System'): Promise<ActiveDeviceInfo> {
    const response = await this.makeRequest<ActiveDeviceInfo>(`v1/GetActiveDeviceInfo.cgi?DeviceClass=${deviceClass}`);
    return response.Body;
  }

  // Utility Methods
  
  async testConnection(): Promise<boolean> {
    try {
      await this.getAPIVersion();
      return true;
    } catch (error) {
      console.error('[API] Connection test failed:', error);
      return false;
    }
  }

  getConfig(): FroniusConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<FroniusConfig>): void {
    this.config = { ...this.config, ...newConfig };
    const port = this.config.port !== 80 ? `:${this.config.port}` : '';
    this.baseUrl = `${this.config.protocol}://${this.config.host}${port}/solar_api`;
  }
}
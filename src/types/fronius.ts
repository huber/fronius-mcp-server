// Fronius API response types

export interface FroniusAPIResponse<T = unknown> {
  Body: T;
  Head: {
    RequestArguments: Record<string, unknown>;
    Status: {
      Code: number;
      Reason: string;
      UserMessage: string;
    };
    Timestamp: string;
  };
}

export interface InverterRealtimeData {
  Data: {
    [deviceId: string]: {
      DT: number;
      DAY_ENERGY: {
        Unit: string;
        Value: number;
      };
      YEAR_ENERGY: {
        Unit: string;
        Value: number;
      };
      TOTAL_ENERGY: {
        Unit: string;
        Value: number;
      };
      PAC: {
        Unit: string;
        Value: number;
      };
      IAC: {
        Unit: string;
        Value: number;
      };
      UAC: {
        Unit: string;
        Value: number;
      };
      FAC: {
        Unit: string;
        Value: number;
      };
      IDC: {
        Unit: string;
        Value: number;
      };
      UDC: {
        Unit: string;
        Value: number;
      };
      DeviceStatus: {
        StatusCode: number;
        MgmtTimerRemainingTime: number;
        ErrorCode: number;
        LEDColor: number;
        LEDState: number;
        StateToReset: boolean;
      };
    };
  };
}

export interface InverterInfo {
  Data: {
    [deviceId: string]: {
      DT: number;
      PVPower: number;
      Show: number;
      StatusCode: number;
      UniqueID: string;
      ErrorCode: number;
      CustomName: string;
    };
  };
}

export interface MeterRealtimeData {
  Data: {
    [meterId: string]: {
      Current_AC_Phase_1: number;
      Current_AC_Phase_2: number;
      Current_AC_Phase_3: number;
      Details: {
        Manufacturer: string;
        Model: string;
        Serial: string;
      };
      EnergyReactive_VArAC_Sum_Consumed: number;
      EnergyReactive_VArAC_Sum_Produced: number;
      EnergyReal_WAC_Sum_Consumed: number;
      EnergyReal_WAC_Sum_Produced: number;
      Frequency_Phase_Average: number;
      Meter_Location_Current: number;
      PowerApparent_S_Sum: number;
      PowerFactor_Sum: number;
      PowerReactive_Q_Sum: number;
      PowerReal_P_Sum: number;
      TimeStamp: number;
      Visible: number;
      Voltage_AC_PhaseToPhase_12: number;
      Voltage_AC_PhaseToPhase_23: number;
      Voltage_AC_PhaseToPhase_31: number;
      Voltage_AC_Phase_1: number;
      Voltage_AC_Phase_2: number;
      Voltage_AC_Phase_3: number;
    };
  };
}

export interface PowerFlowRealtimeData {
  Data: {
    Site: {
      Mode: string;
      P_Akku: number;
      P_Grid: number;
      P_Load: number;
      P_PV: number;
      rel_Autonomy: number;
      rel_SelfConsumption: number;
      E_Day: number;
      E_Total: number;
      E_Year: number;
      Meter_Location: string;
    };
    Inverters: {
      [deviceId: string]: {
        DT: number;
        P: number;
        E_Day: number;
        E_Total: number;
        E_Year: number;
      };
    };
    Version: string;
  };
}

export interface SystemStatus {
  Data: {
    [loggerId: string]: {
      CO2Factor: number;
      CO2Unit: string;
      CashCurrency: string;
      CashFactor: number;
      DefaultLanguage: string;
      DeliveryFactor: number;
      HWVersion: string;
      PlatformID: string;
      ProductID: string;
      SWVersion: string;
      TimestampFormat: string;
      TimeZone: string;
      TimeZoneLocation: string;
      UTCOffset: number;
      VersionAPIv1: string;
      UniqueID: string;
    };
  };
}

export interface ArchiveData {
  Data: {
    [deviceId: string]: {
      Data: {
        [channel: string]: {
          Unit: string;
          Values: {
            [timestamp: string]: number;
          };
        };
      };
      NodeType: number;
      Start: string;
      End: string;
    };
  };
}

export interface SensorRealtimeData {
  Data: {
    [sensorId: string]: {
      [sensorType: string]: {
        Unit: string;
        Value: number;
      };
    };
  };
}

export interface StringRealtimeData {
  Data: {
    [deviceId: string]: {
      [stringId: string]: {
        Current: {
          Unit: string;
          Value: number;
        };
        Voltage: {
          Unit: string;
          Value: number;
        };
      };
    };
  };
}

export interface ActiveDeviceInfo {
  Data: {
    [deviceClass: string]: {
      [deviceId: string]: {
        DT: number;
        Show: number;
      };
    };
  };
}

export interface APIVersion {
  APIVersion: string;
  BaseURL: string;
  CompatibilityRange: string;
}

export interface LoggerLEDInfo {
  Data: {
    [loggerId: string]: {
      LEDColor: number;
      LEDState: number;
    };
  };
}

export interface StorageRealtimeData {
  Data: {
    [deviceId: string]: {
      Controller: {
        Capacity_Maximum: {
          Unit: string;
          Value: number;
        };
        Current_DC: {
          Unit: string;
          Value: number;
        };
        DesignedCapacity: {
          Unit: string;
          Value: number;
        };
        Details: {
          Manufacturer: string;
          Model: string;
          Serial: string;
        };
        Enable: {
          Unit: string;
          Value: number;
        };
        StateOfCharge_Relative: {
          Unit: string;
          Value: number;
        };
        Temperature_Cell: {
          Unit: string;
          Value: number;
        };
        Voltage_DC: {
          Unit: string;
          Value: number;
        };
      };
    };
  };
}

export interface OhmPilotRealtimeData {
  Data: {
    [deviceId: string]: {
      Details: {
        Manufacturer: string;
        Model: string;
        Serial: string;
      };
      PowerReal_P: {
        Unit: string;
        Value: number;
      };
      EnergyReal_WAC_Sum_Consumed: {
        Unit: string;
        Value: number;
      };
      Temperature_Channel_1: {
        Unit: string;
        Value: number;
      };
      StateCode: {
        Unit: string;
        Value: number;
      };
      ErrorCode: {
        Unit: string;
        Value: number;
      };
    };
  };
}
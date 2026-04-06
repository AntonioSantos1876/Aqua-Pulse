// mocks/discoveredDevices.ts
// Mock LoRa/BLE device discovery results for the Add Feeder wizard

import { DiscoveredDevice } from '../types/feeder';

export const MOCK_DISCOVERED_DEVICES: DiscoveredDevice[] = [
  {
    hardwareId: 'AQP-HW-006C',
    signalStrength: -65,
    loraDeviceEUI: 'A84041FFFE778899',
    firmwareVersion: '2.4.1',
    isAlreadyPaired: false,
  },
  {
    hardwareId: 'AQP-HW-007B',
    signalStrength: -81,
    loraDeviceEUI: 'A84041FFFECCDDEEFF',
    firmwareVersion: '2.4.0',
    isAlreadyPaired: false,
  },
  {
    hardwareId: 'AQP-HW-001A',
    signalStrength: -58,
    loraDeviceEUI: 'A84041FFFE1234AB',
    firmwareVersion: '2.4.1',
    isAlreadyPaired: true, // Already configured as Bay 01
  },
];

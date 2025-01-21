export class BluetoothAudioService {
  private device: BluetoothDevice | null = null;
  private gatt: BluetoothRemoteGATTServer | null = null;

  async connect(): Promise<boolean> {
    try {
      // Check if Web Bluetooth API is available
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not available in this browser');
      }

      // Check if we're already connected
      if (this.isConnected()) {
        return true;
      }

      // Request device with more generic filters to improve compatibility
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['0000110b-0000-1000-8000-00805f9b34fb'] }, // A2DP Sink
          { services: ['0000110a-0000-1000-8000-00805f9b34fb'] }, // A2DP Source
        ],
        optionalServices: [
          'battery_service',
          '00001108-0000-1000-8000-00805f9b34fb', // Audio Input Control
          '0000110e-0000-1000-8000-00805f9b34fb', // Audio Stream Control
        ]
      });

      // Setup disconnect handler
      this.device.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));

      // Connect to GATT server
      if (!this.device.gatt) {
        throw new Error('GATT server not available');
      }

      this.gatt = await this.device.gatt.connect();
      
      // Try to get the audio service
      const primaryServices = await this.gatt.getPrimaryServices();
      const hasAudioService = primaryServices.some(service => 
        service.uuid.includes('110a') || service.uuid.includes('110b')
      );

      if (!hasAudioService) {
        throw new Error('No audio service found on device');
      }

      return true;
    } catch (error) {
      console.error('Bluetooth connection failed:', error);
      // Clean up on failure
      await this.disconnect();
      return false;
    }
  }

  private handleDisconnection() {
    this.gatt = null;
    // Attempt to reconnect if disconnection was unexpected
    if (this.device && this.device.gatt) {
      this.reconnect();
    }
  }

  private async reconnect(attempts = 3): Promise<boolean> {
    for (let i = 0; i < attempts; i++) {
      try {
        if (!this.device?.gatt) return false;
        this.gatt = await this.device.gatt.connect();
        return true;
      } catch (error) {
        console.warn(`Reconnection attempt ${i + 1} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between attempts
      }
    }
    return false;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.gatt?.connected) {
        this.gatt.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
    } finally {
      this.device = null;
      this.gatt = null;
    }
  }

  isConnected(): boolean {
    return !!(this.gatt?.connected);
  }

  getDeviceName(): string | null {
    return this.device?.name || null;
  }

  async getBatteryLevel(): Promise<number | null> {
    try {
      if (!this.gatt?.connected) return null;
      
      const batteryService = await this.gatt.getPrimaryService('battery_service');
      const batteryChar = await batteryService.getCharacteristic('battery_level');
      const value = await batteryChar.readValue();
      return value.getUint8(0);
    } catch {
      return null;
    }
  }
}
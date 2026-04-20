import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorWifi } from '@capgo/capacitor-wifi';
import { Platform } from '@ionic/angular';
import { PreferenceManager } from '../../../../shared/preference-manager/preference-manager.service';
import { GoProBluetoothService } from './go-pro-bluetooth.service';

@Injectable({
  providedIn: 'root',
})
export class GoProWifiService {
  readonly id = 'GoProWifiService';

  private readonly preferences = this.preferenceManager.getPreferences(this.id);

  constructor(
    private readonly preferenceManager: PreferenceManager,
    private readonly goProBluetoothService: GoProBluetoothService,
    public platform: Platform
  ) {}

  // eslint-disable-next-line class-methods-use-this
  async isConnectedToGoProWifi(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;

    const { ssid } = await CapacitorWifi.getSsid();
    return ssid.startsWith('GP');
  }

  // eslint-disable-next-line class-methods-use-this
  async getConnectedWifiSSID() {
    if (!Capacitor.isNativePlatform()) return '';

    const { ssid } = await CapacitorWifi.getSsid();
    return ssid;
  }

  async connectToGoProWiFi(): Promise<string> {
    if (!Capacitor.isNativePlatform()) return '';

    await this.goProBluetoothService.enableGoProWifi();
    const creds = await this.goProBluetoothService.getGoProWiFiCreds();
    let { location } = await CapacitorWifi.checkPermissions();
    if (location === 'prompt') {
      const data = await CapacitorWifi.requestPermissions({
        permissions: ['location'],
      });
      location = data.location;
    }
    if (location === 'granted') {
      try {
        await CapacitorWifi.connect({
          ssid: creds.wifiSSID,
          password: creds.wifiPASS,
        });
        return creds.wifiSSID;
      } catch {
        return '';
      }
    }
    return '';
  }

  async showTutorialForMobileDataOnlyApps() {
    if (this.platform.is('ios')) return false;

    const result = await this.preferences.getBoolean(
      PrefKeys.SHOW_MOBILE_DATA_TUTORIAL,
      true
    );

    return result;
  }

  async dontShowAgainTutorialForMobileDataOnlyApps() {
    await this.preferences.setBoolean(
      PrefKeys.SHOW_MOBILE_DATA_TUTORIAL,
      false
    );
  }
}

const enum PrefKeys {
  SHOW_MOBILE_DATA_TUTORIAL = 'GO_PRO_SHOW_MOBILE_DATA_TUTORIAL',
}

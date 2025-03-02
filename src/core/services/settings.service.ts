import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userSettings = {
    darkMode: false,
  };

  getSettings() {
    return this.userSettings;
  }

  toggleDarkMode() {
    this.userSettings.darkMode = !this.userSettings.darkMode;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private settings: any = {
    theme: 'light',
    language: 'en',
  };

  getSetting(key: string) {
    return this.settings[key];
  }

  setSetting(key: string, value: any) {
    this.settings[key] = value;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  trackEvent(eventName: string, data: any) {
    // Logic to send event data to analytics platform
    console.log('Tracking event:', eventName, data);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logError(message: string, error?: any) {
    console.error(message, error);
    // Optionally, send logs to an external service like Sentry
  }

  logInfo(message: string) {
    console.info(message);
  }

  logWarning(message: string) {
    console.warn(message);
  }
}

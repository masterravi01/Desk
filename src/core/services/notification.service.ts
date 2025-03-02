import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notifications.asObservable();

  addNotification(notification: any) {
    this.notifications.next([...this.notifications.value, notification]);
  }

  clearNotifications() {
    this.notifications.next([]);
  }
}

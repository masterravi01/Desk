import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor() {}

  invoke<T>(route: string, data?: any): Observable<T> {
    return from(window.electron.invoke(route, data));
  }
}

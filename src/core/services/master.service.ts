import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor() {}

  invoke<T>(route: string, data?: any): Observable<T> {
    return from(window.electron.invoke(route, data)).pipe(
      catchError((error) => {
        console.error('Error invoking Electron API:', error);
        alert(`Something went wrong:: ${error.message || error}`);
        // You can handle the error as per your needs here
        return throwError(
          () =>
            new Error(`Failed to invoke ${route}: ${error.message || error}`)
        );
      })
    );
  }
}

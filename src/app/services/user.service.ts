import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUsers(): Observable<User[]> {
    return from(window.electron.invoke('getUsers'));
  }

  addUser(user: { name: string; email: string }): Observable<any> {
    return from(window.electron.invoke('addUser', user));
  }

  updateUser(user: {
    id?: number;
    name: string;
    email: string;
  }): Observable<any> {
    return from(window.electron.invoke('updateUser', user));
  }

  deleteUser(userId: number): Observable<any> {
    return from(window.electron.invoke('deleteUser', userId));
  }
}

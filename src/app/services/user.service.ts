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
    constructor() { }

    getUsers(): Observable<User[]> {
        return from(window.electron.invoke('db:getUsers'));
    }

    addUser(user: { name: string; email: string }): Observable<any> {
        return from(window.electron.invoke('db:addUser', user));
    }

    updateUser(user: { id?: number; name: string; email: string }): Observable<any> {
        return from(window.electron.invoke('db:updateUser', user));
    }

    deleteUser(userId: number): Observable<any> {
        return from(window.electron.invoke('db:deleteUser', userId));
    }
}

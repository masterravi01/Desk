import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser')!)
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/login`, { email, password })
      .subscribe((data) => {
        localStorage.setItem('currentUser', JSON.stringify(data));
        this.currentUserSubject.next(data);
        this.router.navigate(['/dashboard']);
      });
  }

  loginA(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  hasRole(requiredRole: any) {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
  getUserRole() {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
  getToken() {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }
  isAuthenticated() {
    const user = this.currentUserSubject.value;
    return user ? true : false;
  }
  getAllUsers(id?: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/user/get-all-users`, { id })
      .pipe(map((res) => res.data.filter((e: any) => e.isEmailVerified)));
  }

  getObservable() {
    return new Observable((observeable) => {
      setTimeout(() => {
        observeable.next('hi from 1');
      }, 1000);
      setTimeout(() => {
        observeable.next('hi from 2');
      }, 2000);
      setTimeout(() => {
        observeable.complete();
      }, 4000);
    });
  }
  getPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('done !');
      }, 2000);
    });
  }
}

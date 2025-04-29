import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';

interface LoginResponse {
  username: string;
  email: string;
  token: string;
  userId: string;
  error: string;
}

interface RegisterResponse {
  message: string;
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { } // Dependecy Injection

  private apiUrl = "http://localhost:9000/api/auth/login";
  private currentUser = new BehaviorSubject<any>(null);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, {
      "username": username,
      "password": password
    }).pipe(
      tap(response => {
        // Store user data and token

        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.username));
        // console.log("Response", response);

        this.currentUser.next(response.username);
      })
    );
  }

  register(name: string, username: string, password: string, email: string) {

    const apiUrl = "http://localhost:9000/api/auth/register";

    return this.http.post<RegisterResponse>(apiUrl, {
      "name": name,
      "username": username,
      "password": password,
      "email": email
    }).pipe(
      tap(response => {
        // Store token
        localStorage.setItem('auth_token', response.token);
      }))

  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('auth_token');

    return this.http.get('http://localhost:9000/api/user/validate', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(() => true), // token is valid
      catchError((error) => {
        if (error.status === 403) {
          // console.warn('Token is invalid or expired.');
        } else {
          // console.error('Token validation error:', error);
        }
        return of(false); // return an observable with false
      })
    );
  }


  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(["/"]);
  }
}

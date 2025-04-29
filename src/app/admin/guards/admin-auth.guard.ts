import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';


export const adminAuthGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const http = inject(HttpClient);

  const token = localStorage.getItem('auth_token');

  if (!token) {
    router.navigate(['/admin/login']);
    return of(false);
  }

  return http.get('http://localhost:9000/api/admin/validate', {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    map(() => true), // token is valid
    catchError((error) => {
      if (error.status === 403) {
        console.warn('Token is invalid or expired.');
      } else {
        console.error('Token validation error:', error);
      }
      router.navigate(['/admin/login']);
      return of(false);
    })
  );
};

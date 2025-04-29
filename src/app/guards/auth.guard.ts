import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const toast = inject(HotToastService);

  const token = localStorage.getItem('auth_token');

  if (!token) {

    toast.error("User not logged In !!!")
    const loading = toast.loading("Redirecting To Login Page")

    setTimeout(() => {
      loading.close();
      router.navigate(['/login']);
    }, 1000);


    return of(false);
  }

  return http.get('http://localhost:9000/api/user/validate', {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    map(() => true), // token is valid
    catchError((error) => {
      if (error.status === 403) {
        toast.error("Token is invalid or expired.");
        console.warn('Token is invalid or expired.');
      } else {
        toast.error("Token is invalid or expired.");
        console.error('Token validation error:', error);
      }
      router.navigate(['/login']);
      return of(false);
    })
  );

};

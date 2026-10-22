import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Api } from '../services/servAPI/api';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(Api);
  const router = inject(Router);

  // Si la solicitud es de login, continua sin modificar
  if (req.url.includes('/login')) {
    return next(req);
  }

  const token = apiService.getToken();

  // Si no hay token, continua sin modificar
  if (!token) {
    return next(req);
  }

  // Clona la solicitud y agrega el encabezado de autorizacion
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = apiService.getRefreshToken();

      if (!refreshToken) {
        apiService.limpiarTokens();
        router.navigate(['/bienvenido']);
        return throwError(() => error);
      }

      // Intenta renovar el token
      return apiService.refrescarToken().pipe(
        switchMap((response: any) => {
          const newAuthReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.accessToken}`,
            },
          });
          return next(newAuthReq);
        }),
        catchError((refreshError) => {
          apiService.limpiarTokens();
          router.navigate(['/bienvenido']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};

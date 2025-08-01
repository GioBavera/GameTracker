import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';

// Su funcion es interceptar las solicitudes HTTP y agregar el token de autorizacion una vez registrado.
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay un token, se clona la solicitud y se agrega el encabezado de autorización.
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, simplemente se pasa la solicitud original.
  return next(req);
};

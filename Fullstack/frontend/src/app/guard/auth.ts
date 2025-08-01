import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// CanActivateFn define si se puede acceder una ruta. Si retorna true, se puede acceder, si retorna false, no se puede.
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) {
    return true;
  }else{
    return router.navigate(['/login']);
  }
};
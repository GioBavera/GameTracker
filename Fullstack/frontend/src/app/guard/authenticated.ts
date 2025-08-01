import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// En este caso, hace lo contrario a auth. Bloquea el acceso a login/register si el usuario ya está autenticado.
export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) {
    return router.navigate(['/home']);
  }else{
    return true;
  }
};
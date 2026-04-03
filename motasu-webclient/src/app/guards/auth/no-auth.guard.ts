import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';

/**
 * Guard pour la page auth (/auth)
 * Si déjà connecté → redirect vers l'accueil
 * Si pas connecté → laisser passer
 */
export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  console.log('🔓 noAuthGuard: isInitialized =', userService.isInitialized());
  console.log('🔓 noAuthGuard: isLoggedIn =', userService.isLoggedIn());

  // Si pas encore initialisé, laisser passer
  if (!userService.isInitialized()) {
    console.log('⏳ noAuthGuard: Not initialized yet, allowing to proceed');
    return true;
  }

  // Si déjà connecté, rediriger vers l'accueil
  if (userService.isLoggedIn()) {
    console.log('🔓 noAuthGuard: Already logged in, redirecting to home');
    router.navigate(['/']);
    return false;
  }

  console.log('🔓 noAuthGuard: Not logged in, allowing access to /auth');
  return true;
};

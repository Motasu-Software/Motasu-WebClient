import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const platformId = inject(PLATFORM_ID);
  
  // Laisse passer la requête côté serveur (SSR) pour éviter de bloquer le rendu
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  // Vérifie simplement si un utilisateur est connecté en mémoire
  if (!userService.isLoggedIn()) {
    return router.createUrlTree(['/auth']); // Redirection propre vers la page de login
  }

  return true; // L'utilisateur est connecté, on le laisse accéder à la route
};
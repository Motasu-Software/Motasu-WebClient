import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { JwtService } from '../../services/auth/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const platformId = inject(PLATFORM_ID);
  
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  const token = userService.getToken();
  if (!token || !inject(JwtService).isTokenValid(token)) {
    userService.clearUser();
    return router.createUrlTree(['/auth']); // Utilise createUrlTree pour les Guards
  }

  return true;
};
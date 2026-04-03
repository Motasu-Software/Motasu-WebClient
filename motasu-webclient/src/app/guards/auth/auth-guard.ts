import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { JwtService } from '../../services/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const jwtService = inject(JwtService);

  const token = userService.getToken();

  // Check if token exists and is valid
  if (!token || !jwtService.isTokenValid(token)) {
    userService.clearUser();
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
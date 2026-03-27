import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = false;//inject(null).isLoggedIn();
  
  if (!isLoggedIn) {
    router.navigate(['/auth']);
    return false;
  }
  return true;

};
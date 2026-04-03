import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';

/**
 * Guard qui attend que UserService soit initialisé
 * (pas encore chargé depuis localStorage)
 */
export const authInitializedGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);

  // Le guard retourne false jusqu'à ce que isInitialized soit true
  // Angular va retry automatiquement
  if (!userService.isInitialized()) {
    console.log('⏳ authInitializedGuard: Waiting for initialization...');
    return false;
  }

  console.log('✅ authInitializedGuard: Ready to proceed');
  return true;
};

import { Inject, Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { firstValueFrom } from 'rxjs';
import { AuthStrategy } from './auth-strategy.interface';
import { AUTH_STRATEGY } from '../../app.config';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializerService {
  constructor(
    private userService: UserService,
    @Inject(AUTH_STRATEGY) private authStrategy: AuthStrategy,
  ) {}

  async initialize(): Promise<void> {
    console.log('🔐 AuthInitializer: Starting verification with cookie');

    try {
      // Le navigateur enverra automatiquement le cookie HttpOnly ici
      const user: User = await firstValueFrom(this.authStrategy.verifyToken());

      if (user) {
        console.log('✅ AuthInitializer: Cookie valid, user verified');
        this.userService.setUser(user);
      } else {
        this.userService.clearUser();
      }
    } catch (error: any) {
      // Si 401 ou erreur, cela veut dire que le cookie est absent ou expiré
      console.warn('🔐 AuthInitializer: Verification failed (no cookie or expired)', error.message);
      this.userService.clearUser();
    }
  }
}
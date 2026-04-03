import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { JwtService } from '../auth/jwt.service';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../config/config-service';

@Injectable({
  providedIn: 'root',
})
export class AuthInitializerService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Initialize authentication on app startup
   * Verifies that the stored token is still valid and user exists on the server
   */
  async initialize(): Promise<void> {
    console.log('🔐 AuthInitializer: Starting');
    
    const token = this.userService.getToken();

    // No token stored, nothing to verify
    if (!token) {
      console.log('🔐 AuthInitializer: No token found, skipping verification');
      return;
    }

    console.log('🔐 AuthInitializer: Token found, checking expiry');

    // Token is expired, clear user and return
    if (!this.jwtService.isTokenValid(token)) {
      console.warn('🔐 AuthInitializer: Token expired, clearing user');
      this.userService.clearUser();
      return;
    }

    console.log('🔐 AuthInitializer: Token valid, verifying with backend');

    // Token is valid, verify user exists on server
    try {
      const apiUrl = this.configService.getConfig().apiUrl;
      
      // Si pas d'apiUrl configurée, juste garder le token local
      if (!apiUrl) {
        console.warn('🔐 AuthInitializer: No API URL configured, skipping backend verification');
        console.log('✅ AuthInitializer: Token loaded from localStorage');
        return;
      }

      const response = await firstValueFrom(
        this.http.get<any>(`${apiUrl}/api/auth/verify`)
      );

      // User verified successfully
      if (response && response.user) {
        console.log('✅ AuthInitializer: User verified successfully');
        // Update user data from server (in case it changed)
        this.userService.setUser(response.user, token);
      } else {
        console.warn('🔐 AuthInitializer: Invalid response from server');
        this.userService.clearUser();
      }
    } catch (error) {
      // Verification failed - could be network error or 401
      console.error('🔐 AuthInitializer: Verification failed:', error);
      
      // Si c'est un 401, effacer l'utilisateur
      const httpError = error as any;
      if (httpError?.status === 401) {
        console.warn('🔐 AuthInitializer: 401 Unauthorized - clearing user');
        this.userService.clearUser();
      } else {
        // Pour d'autres erreurs (réseau, etc.), garder le token local
        // L'utilisateur peut rester connecté même si la vérification échoue
        console.warn('🔐 AuthInitializer: Verification failed but keeping token (network issue?)');
        console.log('✅ AuthInitializer: Token loaded from localStorage (unverified)');
      }
    }
  }
}


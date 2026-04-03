import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user/user.service';
import { JwtService } from './jwt.service';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config/config-service';

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
    const token = this.userService.getToken();

    // No token stored, nothing to verify
    if (!token) {
      return;
    }

    // Token is expired, clear user and return
    if (!this.jwtService.isTokenValid(token)) {
      this.userService.clearUser();
      return;
    }

    // Token is valid, verify user exists on server
    try {
      const apiUrl = this.configService.getConfig().apiUrl;
      const response = await firstValueFrom(
        this.http.get<any>(`${apiUrl}/api/auth/verify`)
      );

      // User verified successfully
      if (response && response.user) {
        // Update user data from server (in case it changed)
        this.userService.setUser(response.user, token);
      }
    } catch (error) {
      // Verification failed, clear user
      console.error('Failed to verify user on startup:', error);
      this.userService.clearUser();
    }
  }
}

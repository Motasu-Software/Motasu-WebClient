import { Injectable, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../model/user.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = signal<User | null>(null);
  authToken = signal<string | null>(null);
  isLoading = signal(false);
  isInitialized = signal(false);

  private readonly USER_STORAGE_KEY = 'currentUser';
  private readonly TOKEN_STORAGE_KEY = 'authToken';
  private platformId = inject(PLATFORM_ID);

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.USER_STORAGE_KEY);
        }
      }
    });

    effect(() => {
      const token = this.authToken();
      if (isPlatformBrowser(this.platformId)) {
        if (token) {
          localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
        } else {
          localStorage.removeItem(this.TOKEN_STORAGE_KEY);
        }
      }
    });
  }

  public initSynchronously(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
        if (storedUser) {
          this.currentUser.set(JSON.parse(storedUser));
        }

        const storedToken = localStorage.getItem(this.TOKEN_STORAGE_KEY);
        if (storedToken) {
          this.authToken.set(storedToken);
        }
      } catch (e) {
        console.error('Error during storage initialization', e);
      } finally {
        this.isInitialized.set(true);
      }
    } else {
      this.isInitialized.set(true);
    }
  }

  setUser(user: User, token?: string): void {
    this.currentUser.set(user);
    if (token) {
      this.authToken.set(token);
    }
  }

  clearUser(): void {
    this.currentUser.set(null);
    this.authToken.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null && this.authToken() !== null;
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    return this.authToken();
  }

  setToken(token: string): void {
    this.authToken.set(token);
  }
}
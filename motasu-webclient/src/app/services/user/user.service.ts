import { Injectable, afterNextRender, effect, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private platformId = inject(PLATFORM_ID);
  
  currentUser = signal<User | null>(null);
  authToken = signal<string | null>(null);
  isLoading = signal(false);

  private readonly USER_STORAGE_KEY = 'currentUser';
  private readonly TOKEN_STORAGE_KEY = 'authToken';

  constructor() {
    // 1. Chargement initial (Uniquement au premier rendu navigateur)
    afterNextRender(() => {
      this.initializeFromStorage();
    });

    // 2. Synchronisation Utilisateur
    effect(() => {
      const user = this.currentUser();
      // On vérifie qu'on est sur le navigateur AVANT de toucher au localStorage
      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.USER_STORAGE_KEY);
        }
      }
    });

    // 3. Synchronisation Token
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

  private initializeFromStorage(): void {
    // Ici, on est déjà dans afterNextRender, donc localStorage est garanti
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    }

    const storedToken = localStorage.getItem(this.TOKEN_STORAGE_KEY);
    if (storedToken) {
      this.authToken.set(storedToken);
    }
  }

  // Connecter un utilisateur avec token
  setUser(user: User, token?: string): void {
    this.currentUser.set(user);
    if (token) {
      this.authToken.set(token);
    }
  }

  // Déconnecter l'utilisateur
  clearUser(): void {
    this.currentUser.set(null);
    this.authToken.set(null);
  }

  // Vérifier si un utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUser() !== null && this.authToken() !== null;
  }

  // Obtenir l'utilisateur actuel
  getUser(): User | null {
    return this.currentUser();
  }

  // Obtenir le token d'authentification
  getToken(): string | null {
    return this.authToken();
  }

  // Définir le token
  setToken(token: string): void {
    this.authToken.set(token);
  }
}

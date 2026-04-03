import { Injectable, effect } from '@angular/core';
import { signal } from '@angular/core';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = signal<User | null>(null);
  authToken = signal<string | null>(null);
  isLoading = signal(false);

  private readonly USER_STORAGE_KEY = 'currentUser';
  private readonly TOKEN_STORAGE_KEY = 'authToken';

  constructor() {
    this.initializeFromStorage();

    // Sync user to localStorage
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.USER_STORAGE_KEY);
      }
    });

    // Sync token to localStorage
    effect(() => {
      const token = this.authToken();
      if (token) {
        localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      }
    });
  }

  // Charger l'utilisateur et le token depuis localStorage au démarrage
  private initializeFromStorage(): void {
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erreur parsing utilisateur stocké:', e);
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

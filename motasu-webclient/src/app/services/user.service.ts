import { Injectable, effect } from '@angular/core';
import { signal } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = signal<User | null>(null);
  isLoading = signal(false);

  constructor() {
    this.initializeFromStorage();

    // Sauvegarde automatique dans localStorage quand l'utilisateur change
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  }

  // Charger l'utilisateur depuis localStorage au démarrage
  private initializeFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch (e) {
        console.error('Erreur parsing utilisateur stocké:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Connecter un utilisateur
  setUser(user: User): void {
    this.currentUser.set(user);
  }

  // Déconnecter l'utilisateur
  clearUser(): void {
    this.currentUser.set(null);
  }

  // Vérifier si un utilisateur est connecté
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // Obtenir l'utilisateur actuel
  getUser(): User | null {
    return this.currentUser();
  }
}

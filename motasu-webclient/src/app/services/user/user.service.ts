import { Injectable, signal } from '@angular/core';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = signal<User | null>(null);
  isLoading = signal(false);
  isInitialized = signal(false);

  constructor() {}

  public initSynchronously(): void {
      this.isInitialized.set(true);
    
  }

  setUser(user: User, token?: string): void {
    this.currentUser.set(user);
  }

  clearUser(): void {
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getUser(): User | null {
    return this.currentUser();
  }


}
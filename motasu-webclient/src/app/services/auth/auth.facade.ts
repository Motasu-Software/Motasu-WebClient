import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthStrategy } from './auth-strategy.interface';
import { AUTH_STRATEGY } from '../../app.config';
import { UserService } from '../user/user.service';
import { User } from '../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(
    @Inject(AUTH_STRATEGY) private authStrategy: AuthStrategy,
    private userService: UserService,
    private router: Router
  ) {}

  /**
   * Connexion avec email et password
   */
  login(email: string, password: string): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    console.log('🔐 Tentative de connexion pour:', email);

    return this.authStrategy.login(email, password).pipe(
      tap((user: User) => {
        this.loadingSubject.next(false);
        console.log('✅ Authentification réussie pour:', email);
      }),
      catchError((error: any) => {
        this.loadingSubject.next(false);
        
        let errorMessage = 'Erreur de connexion';
        
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.graphQLErrors?.[0]?.message) {
          errorMessage = error.graphQLErrors[0].message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        console.error('❌ Erreur login:', errorMessage, error);
        this.errorSubject.next(errorMessage);
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    // Note : Idéalement, tu devrais aussi appeler this.authStrategy.logout() 
    // pour que ton backend supprime le cookie HttpOnly (ex: en mettant sa date d'expiration à 0).
    this.authStrategy.logout('').subscribe({
      next: () => {
        console.log('✅ Logout API call successful');
      },
      error: (error) => {
        console.warn('⚠️ Logout API call failed, but proceeding with client-side logout', error);
      }
    });
    this.userService.clearUser();
    this.errorSubject.next(null);
    this.router.navigate(['/auth']);
    console.log('✅ Déconnexion réussie');
  }

  getCurrentUser() {
    return this.userService.currentUser();
  }

  get currentUser$() {
    return this.userService.currentUser;
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  getError(): string | null {
    return this.errorSubject.value;
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthStrategy } from './auth-strategy.interface';
import { AUTH_STRATEGY } from '../../app.config';
import { UserService } from '../user/user.service';
import { JwtService } from './jwt.service';
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
    private jwtService: JwtService,
    private router: Router
  ) {}

  /**
   * Connexion avec email et password
   * Utilise l'interface AuthStrategy pour permettre des implémentations différentes
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
        
        // Traiter différents types d'erreurs
        let errorMessage = 'Erreur de connexion';
        
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.graphQLErrors?.[0]?.message) {
          // Erreur GraphQL
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
    this.userService.clearUser();
    this.errorSubject.next(null);
    this.router.navigate(['/auth']);
    console.log('✅ Déconnexion réussie');
  }

  /**
   * Récupérer l'utilisateur courant (Signal réactif)
   */
  getCurrentUser() {
    return this.userService.currentUser();
  }

  /**
   * Signal réactif pour observer les changements d'utilisateur
   */
  get currentUser$() {
    return this.userService.currentUser;
  }

  /**
   * Vérifier si connecté
   */
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  /**
   * Récupérer le token
   */
  getToken(): string | null {
    return this.userService.getToken();
  }

  /**
   * Vérifier si le token est valide
   */
  isTokenValid(): boolean {
    const token = this.userService.getToken();
    return token ? this.jwtService.isTokenValid(token) : false;
  }

  /**
   * Obtenir le temps avant expiration du token (en secondes)
   */
  getTimeUntilTokenExpiry(): number | null {
    const token = this.userService.getToken();
    return token ? this.jwtService.getTimeUntilExpiry(token) : null;
  }

  /**
   * Récupérer l'état actuel du chargement
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Récupérer le message d'erreur actuel
   */
  getError(): string | null {
    return this.errorSubject.value;
  }

  /**
   * Effacer le message d'erreur
   */
  clearError(): void {
    this.errorSubject.next(null);
  }
}


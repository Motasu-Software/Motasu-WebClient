import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '../../services/auth/auth.facade';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.css',
})
export class AuthContainer implements OnInit, OnDestroy {
  authForm: FormGroup;
  isRegisterMode: boolean = false;
  errorMessage: string | null = null;
  isLoading = signal(false);

  private slideInterval: any;
  currentSlideIndex = signal(0);

  constructor(
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private router: Router
  ) {
    // Créer le formulaire avec FormControl explicites
    this.authForm = this.fb.group({
      username: new FormControl(''),
      iRacingCode: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
    this.startCarousel();
    // Initialiser la validation correcte
    this.updateFormValidation();
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = null;
    this.authForm.reset();
    // Mettre à jour la validation quand on change de mode
    this.updateFormValidation();
  }

  /**
   * ✨ Mettre à jour la validation selon le mode (Login vs Register)
   */
  private updateFormValidation() {
    const emailControl = this.authForm.get('email');
    const passwordControl = this.authForm.get('password');
    const usernameControl = this.authForm.get('username');
    const iRacingCodeControl = this.authForm.get('iRacingCode');

    if (this.isRegisterMode) {
      // 📝 Mode REGISTER - tous les champs requis
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      usernameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      iRacingCodeControl?.setValidators([]);
    } else {
      // 🔐 Mode LOGIN - seulement email et password
      emailControl?.setValidators([Validators.required, Validators.email]);
      passwordControl?.setValidators([Validators.required]);
      usernameControl?.setValidators([]); // Pas requis en mode login
      iRacingCodeControl?.setValidators([]);
    }

    // Appliquer les validateurs
    emailControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    usernameControl?.updateValueAndValidity();
    iRacingCodeControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.errorMessage = this.getErrorMessage();
      return;
    }

    if (this.isRegisterMode) {
      // TODO: Implémenter l'enregistrement
      this.errorMessage = 'Enregistrement non encore implémenté';
      console.log('Registering user with data:', this.authForm.value);
    } else {
      // 🎯 LOGIN - Une seule méthode
      this.loginUser();
    }
  }

  /**
   * Message d'erreur dynamique selon le champ invalide
   */
  private getErrorMessage(): string {
    const emailControl = this.authForm.get('email');
    const passwordControl = this.authForm.get('password');
    const usernameControl = this.authForm.get('username');

    if (emailControl?.hasError('required')) {
      return 'L\'email est requis';
    }
    if (emailControl?.hasError('email')) {
      return 'Veuillez entrer un email valide';
    }
    if (passwordControl?.hasError('required')) {
      return 'Le mot de passe est requis';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (this.isRegisterMode && usernameControl?.hasError('required')) {
      return 'Le nom d\'utilisateur est requis';
    }

    return 'Veuillez remplir tous les champs correctement';
  }

  private loginUser() {
    const { email, password } = this.authForm.value;
    this.isLoading.set(true);
    this.errorMessage = null;

    // 🔒 Désactiver tous les inputs à partir du FormControl (pas du HTML)
    this.disableAllControls();

    this.authFacade.login(email, password).subscribe({
      next: (user) => {
        console.log('✅ Connecté en tant que:', user.email);
        this.isLoading.set(false);
        // Réactiver les controls
        this.enableAllControls();
        // Redirection vers le dashboard
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('❌ Erreur de connexion:', error);
        this.errorMessage = error.message || 'Erreur de connexion';
        this.isLoading.set(false);
        // Réactiver les controls pour que l'utilisateur puisse réessayer
        this.enableAllControls();
      }
    });
  }

  /**
   * Désactiver tous les controls du formulaire
   * Ceci gère le disabled state de manière propre avec les FormControls
   */
  private disableAllControls() {
    Object.keys(this.authForm.controls).forEach(key => {
      this.authForm.get(key)?.disable();
    });
  }

  /**
   * Réactiver tous les controls du formulaire
   */
  private enableAllControls() {
    Object.keys(this.authForm.controls).forEach(key => {
      this.authForm.get(key)?.enable();
    });
  }

  startCarousel() {
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex.update(index => (index + 1) % 3);
    }, 3000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}



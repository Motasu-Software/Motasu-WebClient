import { Component, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-home-component',
  imports: [],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  private router = inject(Router);
  private userService = inject(UserService);

  constructor() {
    // Vérifier après initialisation si l'utilisateur est connecté
    // Si pas connecté → rediriger vers /auth
   
  }
}


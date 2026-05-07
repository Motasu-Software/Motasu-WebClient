import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile/user-profile.service';
import { ThemeService } from '../../services/theme/theme.service';
import { User } from '../../model/user.model';
import { Post } from '../../model/post';

@Component({
  selector: 'app-user-profile-component',
  imports: [CommonModule],
  templateUrl: './user-profile-component.html',
  styleUrl: './user-profile-component.css',
})
export class UserProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  userProfileService = inject(UserProfileService);
  themeService = inject(ThemeService);

  user = signal<User | null>(null);
  userPosts = signal<Post[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  userEmail = signal<string>('');

  ngOnInit() {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.userEmail.set(email);
      this.loadUserProfile(email);
      this.loadUserPosts(email);
    } else {
      this.errorMessage.set('Utilisateur non trouvé.');
      this.isLoading.set(false);
    }
  }

  loadUserProfile(email: string) {
    this.userProfileService.getUserProfile(email).subscribe({
      next: (user) => {
        this.user.set(user);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'Erreur lors du chargement du profil.');
      },
    });
  }

  loadUserPosts(email: string) {
    this.userProfileService.getUserPosts(email).subscribe({
      next: (result) => {
        this.userPosts.set(result.items);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'Erreur lors du chargement des posts.');
        this.isLoading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  trackByPost(index: number, post: Post) {
    return post.id;
  }
}

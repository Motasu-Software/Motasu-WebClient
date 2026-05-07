import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Post } from '../../model/post';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  router = inject(Router);
  postService = inject(PostService);
  userService = inject(UserService);
  themeService = inject(ThemeService);

  posts = signal<Post[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;
  currentUserEmail = signal<string>('');

  constructor() {
    this.loadCurrentUser();
    this.loadPosts();
  }

  loadCurrentUser() {
    const user = this.userService.getUser();
    if (user) {
      this.currentUserEmail.set(user.email);
    }
  }

  loadPosts(page = 1) {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.postService.getPosts(page, this.pageSize).subscribe({
      next: (result) => {
        this.posts.set(result.items);
        this.currentPage.set(result.page);
        this.totalPages.set(result.totalPages);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'Impossible de charger les posts.');
        this.isLoading.set(false);
      },
    });
  }

  goToCreatePost() {
    this.router.navigate(['/posts/new']);
  }

  goToProfile(authorEmail: string) {
    this.router.navigate(['/users', authorEmail]);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  canDeletePost(post: Post): boolean {
    return this.currentUserEmail() === post.authorEmail;
  }

  deletePost(post: Post) {
    if (!this.canDeletePost(post)) {
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.postService.deletePost(post.id).subscribe({
        next: () => {
          // Recharger les posts après suppression
          this.loadPosts(this.currentPage());
        },
        error: (error) => {
          this.errorMessage.set(error?.message || 'Impossible de supprimer le post.');
        },
      });
    }
  }

  trackByPost(index: number, post: Post) {
    return post.id;
  }
}


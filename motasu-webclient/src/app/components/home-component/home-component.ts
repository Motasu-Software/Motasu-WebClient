import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { Post } from '../../model/post';

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  private router = inject(Router);
  private postService = inject(PostService);
  private userService = inject(UserService);

  posts = signal<Post[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;

  constructor() {
    this.loadPosts();
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

  trackByPost(index: number, post: Post) {
    return post.id;
  }
}


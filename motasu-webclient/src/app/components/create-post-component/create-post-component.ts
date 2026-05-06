import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'app-create-post-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-component.html',
  styleUrl: './create-post-component.css',
})
export class CreatePostComponent {
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  postForm: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private postService: PostService,
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      circuit: ['', [Validators.required]],
      car: ['', [Validators.required]],
      lapTime: ['', [Validators.required]],
    });
  }

  submitForm() {
    if (this.postForm.invalid) {
      this.errorMessage.set('Veuillez remplir correctement tous les champs.');
      return;
    }

    const formValue = this.postForm.value as {
      title: string;
      description: string;
      circuit: string;
      car: string;
      lapTime: string;
    };

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.postService.createPost(
      formValue.title,
      formValue.description,
      formValue.circuit,
      formValue.car,
      formValue.lapTime,
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage.set(error?.message || 'Erreur lors de la création du post.');
        this.isLoading.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}

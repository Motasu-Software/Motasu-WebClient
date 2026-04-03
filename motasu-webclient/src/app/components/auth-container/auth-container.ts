import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.css',
})
export class AuthContainer {
  authForm: FormGroup;
  isRegisterMode: boolean = false;

  private slideInterval: any;
  currentSlideIndex = signal(0);
  
  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      username: [''],
      iRacingCode: [''],
      email: [''],
      password: ['']
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onSubmit() {
    if (this.isRegisterMode){
      console.log('Registering user with data:', this.authForm.value);

    }else{
      console.log('Logging in user with data:', this.authForm.value);
    }
  }

  ngOnInit() {
    this.startCarousel();
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

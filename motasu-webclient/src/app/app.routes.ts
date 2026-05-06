import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component';
import { CreatePostComponent } from './components/create-post-component/create-post-component';
import { AuthContainer } from './components/auth-container/auth-container';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'posts/new', 
    component: CreatePostComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'auth', 
    component: AuthContainer 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
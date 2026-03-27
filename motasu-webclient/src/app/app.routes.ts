import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { HomeComponent } from './components/home-component/home-component';
import { AuthContainer } from './components/auth-container/auth-container';
export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {   
        path: 'auth',
        component: AuthContainer
    }


];

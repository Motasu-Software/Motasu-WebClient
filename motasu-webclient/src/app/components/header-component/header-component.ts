import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header-component',
  imports: [CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  router = inject(Router);
  themeService = inject(ThemeService);
  userService = inject(UserService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.userService.clearUser();
    this.router.navigate(['/auth']);
  }
}

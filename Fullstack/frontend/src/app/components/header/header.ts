import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})

export class Header {

  showLogout = true;

  constructor(private router: Router, private authService : AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hideLogoutRoutes = ['/login', '/register'];  // Oculta la opcion 'logout' cuando se registra o inicia sesion.
      this.showLogout = !hideLogoutRoutes.includes(event.urlAfterRedirects);
    });
  }
  
  navigate(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  logout(): void {
    this.authService.logout();
  }

}

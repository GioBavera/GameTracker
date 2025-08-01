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

  // Escucha los eventos de navegacion para mostrar u ocultar la opción de logout.
  // Oculta la opcion 'logout' cuando se registra o inicia sesion.
  // Muestra la opcion 'logout' en todas las demas rutas.
  constructor(private router: Router, private authService : AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hideLogoutRoutes = ['/login', '/register'];  // Oculta la opcion 'logout' cuando se registra o inicia sesion.
      this.showLogout = !hideLogoutRoutes.includes(event.urlAfterRedirects);
    });
  }
  
  // En base a lo que se selecciones en la barra (HTML), se redirige a la ruta correspondiente.
  navigate(path: string): void {
    this.router.navigate([path]);
  }

  // Para saber si la ruta actual es la misma que la ruta proporcionada.
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // Cierra la sesion del usuario.
  logout(): void {
    this.authService.logout();
  }

}

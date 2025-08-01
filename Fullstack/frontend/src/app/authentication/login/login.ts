import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export default class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router){}

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']); // Redirige despues del login exitoso
      },
      error: (err) => {
        alert('Correo o contraseña incorrectos.');
      }
    });
  }
}
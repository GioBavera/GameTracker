import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})

export default class RegisterComponent {
  registerForm: FormGroup;
  registerError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    // Registro incorrecto.
    if (this.registerForm.invalid) {
      this.registerError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    // Caso de registro exitoso.
    const { nombre, email, password } = this.registerForm.value;

    this.authService.register(nombre, email, password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Error en el registro', err);
        this.registerError = 'No se pudo completar el registro. Intenta nuevamente.';
      }
    });
  }
}

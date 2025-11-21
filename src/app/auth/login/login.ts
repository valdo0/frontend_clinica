import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {
  showPassword = false;
  isLoading = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private authService = inject(Auth);
  private router = inject(Router);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ingresar() {
    if (this.form.valid) {
      this.isLoading = true;
      
      const { email, password } = this.form.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (user) => {
          this.isLoading = false;
          
          Swal.fire({
            title: `¡Bienvenido, ${user.nombre}!`,
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            if (user.rol === 'PACIENTE') {
              this.router.navigate(['/paciente/mis-solicitudes']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Login error:', err);
          
          Swal.fire({
            title: 'Error de inicio de sesión',
            text: 'Credenciales inválidas o error en el servidor.',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }
}

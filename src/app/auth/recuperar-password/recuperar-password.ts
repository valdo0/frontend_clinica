import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.scss',
})
export default class RecuperarPassword {
  private authService = inject(Auth);
  private router = inject(Router);

  step: 'request' | 'reset' = 'request';
  isLoading = false;
  generatedCode = '';

  requestForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  resetForm = new FormGroup({
    codigo: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\d{6}$/),
    ]),
    nuevaPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.requestForm.get('email');
  }

  get codigo() {
    return this.resetForm.get('codigo');
  }

  get nuevaPassword() {
    return this.resetForm.get('nuevaPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  get passwordsMatch(): boolean {
    const password = this.nuevaPassword?.value;
    const confirm = this.confirmPassword?.value;
    return password === confirm;
  }

  requestRecoveryCode() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.email!.value!;

    this.authService.requestPasswordRecovery({ email }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.generatedCode = response.codigo;
        this.step = 'reset';

        Swal.fire({
          icon: 'success',
          title: 'Código generado',
          html: `
            <p>Se ha generado un código de recuperación:</p>
            <div class="alert alert-info mt-3">
              <h3 class="mb-0"><strong>${response.codigo}</strong></h3>
            </div>
            <p class="text-muted mt-3"><small>Este código expira en 15 minutos</small></p>
          `,
          confirmButtonText: 'Continuar',
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error requesting recovery:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo generar el código de recuperación. Verifique que el email existe.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    if (!this.passwordsMatch) {
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Por favor, verifique que ambas contraseñas sean iguales.',
      });
      return;
    }

    this.isLoading = true;
    const email = this.email!.value!;
    const codigo = this.codigo!.value!;
    const nuevaPassword = this.nuevaPassword!.value!;

    this.authService.resetPassword({ email, codigo, nuevaPassword }).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error resetting password:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'No se pudo actualizar la contraseña. Verifique que el código sea correcto y no haya expirado.',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  backToRequest() {
    this.step = 'request';
    this.resetForm.reset();
    this.generatedCode = '';
  }
}

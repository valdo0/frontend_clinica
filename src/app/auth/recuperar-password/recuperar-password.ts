import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.scss',
})
export default class RecuperarPassword {

  mensajeExito: string | null = null;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

    enviarInstrucciones() {
    if (this.form.valid) {
      this.mensajeExito = 'Si existe una cuenta con ese correo electrónico, hemos enviado las instrucciones de recuperación.';
      this.form.reset();
    } else {
      this.form.markAllAsTouched();
    }
  }
}

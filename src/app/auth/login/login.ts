import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {
  showPassword = false;
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router) {}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  ingresar() {
    this.router.navigate(['/dashboard']);
  }
}

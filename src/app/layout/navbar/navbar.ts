import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(Auth);

  get user() {
    return this.authService.getUser();
  }

  get isAdmin() {
    return this.user?.rol === 'ADMIN';
  }

  get isLabManager() {
    return this.user?.rol === 'LABMANAGER';
  }

  get isPaciente() {
    return this.user?.rol === 'PACIENTE';
  }

  logout() {
    this.authService.logout();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Usuario } from '../../core/models';
import { ApiService } from '../../core/services/api';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface UpdateUsuarioRequest {
  nombre: string;
  telefono: string;
  password?: string;
}

@Component({
  selector: 'app-modificar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modificar-perfil.html',
  styleUrl: './modificar-perfil.scss',
})
export default class ModificarPerfil implements OnInit {
  private authService = inject(Auth);
  private apiService = inject(ApiService);
  private router = inject(Router);
  nombre = '';
  email = '';
  telefono = '';
  rol = '';
  password = '';
  
  isLoading = false;
  currentUser: Usuario | null = null;

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.currentUser = this.authService.getUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.nombre = this.currentUser.nombre;
    this.email = this.currentUser.email;
    this.telefono = this.currentUser.telefono;
    this.rol = this.currentUser.rol;
    this.password = '';
  }

  onSubmit() {
    if (!this.currentUser) {
      alert('Error: No hay usuario autenticado');
      return;
    }

    this.isLoading = true;
    
    const updateData: UpdateUsuarioRequest = {
      nombre: this.nombre,
      telefono: this.telefono
    };

    if (this.password && this.password.trim() !== '') {
      updateData.password = this.password;
    }
    this.apiService.put<Usuario>(`usuarios/${this.currentUser.id}`, updateData)
      .subscribe({
        next: (updatedUser) => {
          this.authService.updateUser(updatedUser);
          this.currentUser = updatedUser;
          
          Swal.fire({
            icon: 'success',
            title: 'Perfil actualizado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.password = '';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar el perfil',
            showConfirmButton: false,
            timer: 1500
          });
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.loadUserData();
  }
}

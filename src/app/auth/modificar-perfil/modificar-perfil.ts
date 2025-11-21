import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modificar-perfil.html',
  styleUrl: './modificar-perfil.scss',
})
export default class ModificarPerfil implements OnInit {
  // Form fields
  nombre = '';
  email = '';
  telefono = '';
  rol = '';
  password = '';
  
  isLoading = false;

  // Mock initial data
  private currentUser = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '+56 9 1234 5678',
    rol: 'PACIENTE'
  };

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Simulate loading data
    this.nombre = this.currentUser.nombre;
    this.email = this.currentUser.email;
    this.telefono = this.currentUser.telefono;
    this.rol = this.currentUser.rol;
    this.password = '';
  }

  onSubmit() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Perfil actualizado:', {
        nombre: this.nombre,
        telefono: this.telefono,
        password: this.password ? '[CHANGED]' : '[UNCHANGED]'
      });
      
      alert('Perfil actualizado exitosamente (Simulación)');
      this.isLoading = false;
      
      // Update mock "current" state
      this.currentUser = {
        ...this.currentUser,
        nombre: this.nombre,
        telefono: this.telefono
      };
    }, 1000);
  }

  resetForm() {
    this.loadUserData();
  }
}

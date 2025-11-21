import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuariosService, Usuario, UsuarioDTO } from '../../../core/services/usuarios';

@Component({
  selector: 'app-agregar-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-usuario.html',
  styleUrl: './agregar-usuario.scss',
})
export default class AgregarUsuario implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() usuario?: Usuario;
  @Input() isAdmin: boolean = false;
  @Output() usuarioGuardado = new EventEmitter<void>();

  private usuariosService = inject(UsuariosService);
  
  // Modal state
  isModalOpen = false;
  
  // Form fields
  nombre = '';
  email = '';
  telefono = '';
  password = '';
  rol: 'USER' | 'ADMIN' = 'USER';
  
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    // Initialization if needed
  }

  abrir() {
    if (this.modo === 'editar' && this.usuario) {
      this.nombre = this.usuario.nombre;
      this.email = this.usuario.email;
      this.telefono = this.usuario.telefono;
      this.rol = this.usuario.rol;
      this.password = ''; // No prellenar password en modo editar
    } else {
      this.resetForm();
    }
    
    this.error = null;
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  cerrar() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  resetForm() {
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.password = '';
    this.rol = 'USER';
  }

  guardarUsuario(form: NgForm) {
    if (form.valid) {
      // En modo editar, password es opcional
      if (this.modo === 'editar' && !this.password) {
        // Si no hay password, no lo incluimos en el DTO
      } else if (this.modo === 'crear' && !this.password) {
        this.error = 'La contraseña es requerida para crear un usuario.';
        return;
      }

      this.isLoading = true;
      this.error = null;

      const data: any = {
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        rol: this.rol
      };

      // Solo incluir password si se proveyó
      if (this.password) {
        data.password = this.password;
      }

      const request = this.modo === 'crear'
        ? this.usuariosService.createUsuario(data as UsuarioDTO)
        : this.usuariosService.updateUsuario(this.usuario!.id, data);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.cerrar();
          this.usuarioGuardado.emit();
          this.resetForm();
          form.reset();
        },
        error: (error) => {
          console.error('Error al guardar usuario:', error);
          this.error = error.error?.message || 'Error al guardar el usuario. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios';
import { Usuario } from '../../../core/models';
import AgregarUsuario from '../agregar-usuario/agregar-usuario';

@Component({
  selector: 'app-listado-usuarios',
  imports: [CommonModule, FormsModule, AgregarUsuario],
  templateUrl: './listado-usuarios.html',
  styleUrl: './listado-usuarios.scss',
})
export default class ListadoUsuarios implements OnInit {
  @ViewChild(AgregarUsuario) modalUsuario!: AgregarUsuario;

  private usuariosService = inject(UsuariosService);

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  
  busqueda = '';
  filtroRol: 'TODOS' | 'USER' | 'ADMIN' = 'TODOS';

  isLoading = false;
  error: string | null = null;

  isCurrentUserAdmin = true;

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.isLoading = true;
    this.error = null;

    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'Error al cargar los usuarios. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.usuarios];

    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(u => 
        u.nombre.toLowerCase().includes(busquedaLower) ||
        u.email.toLowerCase().includes(busquedaLower)
      );
    }

    if (this.filtroRol !== 'TODOS') {
      filtrados = filtrados.filter(u => u.rol === this.filtroRol);
    }

    this.usuariosFiltrados = filtrados;
  }

  abrirModalAgregar() {
    this.modalUsuario.modo = 'crear';
    this.modalUsuario.usuario = undefined;
    this.modalUsuario.isAdmin = this.isCurrentUserAdmin;
    this.modalUsuario.abrir();
  }

  abrirModalEditar(usuario: Usuario) {
    this.modalUsuario.modo = 'editar';
    this.modalUsuario.usuario = usuario;
    this.modalUsuario.isAdmin = this.isCurrentUserAdmin;
    this.modalUsuario.abrir();
  }

  eliminarUsuario(id: number) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) return;

    if (confirm(`¿Está seguro de eliminar al usuario "${usuario.nombre}"?`)) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario. Por favor, intente nuevamente.');
        }
      });
    }
  }

  onUsuarioGuardado() {
    console.log('Usuario guardado, recargando lista...');
    this.cargarUsuarios();
  }

  getRolBadgeClass(rol: string): string {
    switch (rol) {
      case 'admin': return 'bg-danger';
      case 'labmanager': return 'bg-warning text-dark';
      case 'paciente': return 'bg-success';
      case 'ADMIN': return 'bg-danger'; // Fallback
      default: return 'bg-secondary';
    }
  }
}

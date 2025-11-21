import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../../core/services/usuarios';
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
  
  // Filtros
  busqueda = '';
  filtroRol: 'TODOS' | 'USER' | 'ADMIN' = 'TODOS';
  
  isLoading = false;
  error: string | null = null;

  // Simular que el usuario actual es admin (ajustar según implementación real)
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

    // Filtro por búsqueda (nombre o email)
    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(u => 
        u.nombre.toLowerCase().includes(busquedaLower) ||
        u.email.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro por rol
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
    return rol === 'ADMIN' ? 'bg-danger' : 'bg-primary';
  }
}

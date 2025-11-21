import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Laboratorios, Laboratorio } from '../../../core/services/laboratorios';
import AgregarLab from '../agregar-lab/agregar-lab';

@Component({
  selector: 'app-listado-labs',
  imports: [CommonModule, FormsModule, AgregarLab, RouterLink],
  templateUrl: './listado-labs.html',
  styleUrl: './listado-labs.scss',
})
export default class ListadoLabs implements OnInit {
  @ViewChild(AgregarLab) modalLaboratorio!: AgregarLab;
  
  private laboratoriosService = inject(Laboratorios);
  
  laboratorios: Laboratorio[] = [];
  laboratoriosFiltrados: Laboratorio[] = [];
  laboratorioSeleccionado?: Laboratorio;
  
  // Filtros
  busqueda = '';
  filtroEstado: 'TODOS' | 'HABILITADO' | 'DESHABILITADO' = 'TODOS';

  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.cargarLaboratorios();
  }

  cargarLaboratorios() {
    this.isLoading = true;
    this.error = null;

    this.laboratoriosService.getLaboratorios().subscribe({
      next: (laboratorios) => {
        this.laboratorios = laboratorios;
        this.aplicarFiltros();
        this.isLoading = false;
        console.log('Laboratorios cargados:', laboratorios);
      },
      error: (error) => {
        console.error('Error al cargar laboratorios:', error);
        this.error = 'Error al cargar los laboratorios. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros() {
    let filtrados = [...this.laboratorios];

    // Filtro por búsqueda (nombre o dirección)
    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(l => 
        l.nombre.toLowerCase().includes(busquedaLower) ||
        l.direccion.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtro por estado
    if (this.filtroEstado !== 'TODOS') {
      const isHabilitado = this.filtroEstado === 'HABILITADO';
      filtrados = filtrados.filter(l => l.habilitado === isHabilitado);
    }

    this.laboratoriosFiltrados = filtrados;
  }

  abrirModalAgregar() {
    this.modalLaboratorio.modo = 'crear';
    this.modalLaboratorio.laboratorio = undefined;
    this.modalLaboratorio.abrir();
  }

  abrirModalEditar(laboratorio: Laboratorio) {
    this.modalLaboratorio.modo = 'editar';
    this.modalLaboratorio.laboratorio = laboratorio;
    this.modalLaboratorio.abrir();
  }

  eliminarLaboratorio(id: number) {
    const laboratorio = this.laboratorios.find(l => l.id === id);
    if (!laboratorio) return;

    if (confirm(`¿Está seguro de eliminar el laboratorio "${laboratorio.nombre}"?`)) {
      this.laboratoriosService.deleteLaboratorio(id).subscribe({
        next: () => {
          console.log('Laboratorio eliminado exitosamente');
          this.cargarLaboratorios();
        },
        error: (error) => {
          console.error('Error al eliminar laboratorio:', error);
          alert('Error al eliminar el laboratorio. Por favor, intente nuevamente.');
        }
      });
    }
  }

  onLaboratorioGuardado() {
    this.cargarLaboratorios();
  }
}


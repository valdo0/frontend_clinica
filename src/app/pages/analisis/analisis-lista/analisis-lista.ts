import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalisisService } from '../../../core/services/analisis';
import { AnalisisResponseDTO, EstadoAnalisis } from '../../../core/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-analisis-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analisis-lista.html',
  styleUrl: './analisis-lista.scss'
})
export default class AnalisisLista implements OnInit {
  private analisisService = inject(AnalisisService);
  
  analisis: AnalisisResponseDTO[] = [];
  filteredAnalisis: AnalisisResponseDTO[] = [];
  isLoading = true;
  selectedEstado: EstadoAnalisis | 'TODOS' = 'TODOS';

  ngOnInit() {
    this.loadAnalisis();
  }

  loadAnalisis() {
    this.isLoading = true;
    this.analisisService.getAll().subscribe({
      next: (data) => {
        this.analisis = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analisis:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los análisis.',
          timer: 2000
        });
      }
    });
  }

  applyFilter() {
    if (this.selectedEstado === 'TODOS') {
      this.filteredAnalisis = [...this.analisis];
    } else {
      this.filteredAnalisis = this.analisis.filter(a => a.estado === this.selectedEstado);
    }
  }

  onFilterChange(estado: EstadoAnalisis | 'TODOS') {
    this.selectedEstado = estado;
    this.applyFilter();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoBadgeClass(estado: EstadoAnalisis): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      case 'TERMINADO':
        return 'bg-success';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalisisService } from '../../../core/services/analisis';
import { AnalisisResponseDTO, EstadoAnalisis } from '../../../core/models';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.scss'
})
export default class MisSolicitudes implements OnInit {
  filterEstado: string = 'todos';
  solicitudes: AnalisisResponseDTO[] = [];
  isLoading = true;
  error: string | null = null;

  private authService = inject(Auth);
  private analisisService = inject(AnalisisService);

  ngOnInit() {
    this.loadSolicitudes();
  }

  loadSolicitudes() {
    this.isLoading = true;
    this.error = null;
    const user = this.authService.getUser();

    this.analisisService.getAllByUser(user!.id).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading solicitudes:', err);
        this.error = 'No se pudieron cargar las solicitudes.';
        this.isLoading = false;
      }
    });
  }

  get filteredRequests(): AnalisisResponseDTO[] {
    if (this.filterEstado === 'todos') {
      return this.solicitudes;
    }
    return this.solicitudes.filter(s => s.estado === this.filterEstado);
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

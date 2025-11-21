import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Solicitud {
  id: number;
  tipo: string;
  fecha: string;
  estado: 'Pendiente' | 'En Proceso' | 'Cancelada' | 'Completada';
  descripcion: string;
}

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-solicitudes.html',
  styleUrl: './mis-solicitudes.scss'
})
export default class MisSolicitudes {
  filterEstado: string = 'todos';

  // Mock data
  solicitudes: Solicitud[] = [
    { id: 1, tipo: 'Hemograma Completo', fecha: '2023-11-20', estado: 'Pendiente', descripcion: 'Chequeo anual rutinario' },
    { id: 2, tipo: 'Perfil Lipídico', fecha: '2023-11-18', estado: 'En Proceso', descripcion: 'Control de colesterol' },
    { id: 3, tipo: 'Examen de Orina', fecha: '2023-11-15', estado: 'Cancelada', descripcion: 'Error en la solicitud' },
    { id: 4, tipo: 'Glucosa en Ayunas', fecha: '2023-11-21', estado: 'Pendiente', descripcion: 'Sospecha de diabetes' },
    { id: 5, tipo: 'Perfil Hepático', fecha: '2023-11-10', estado: 'Completada', descripcion: 'Control post-tratamiento' }
  ];

  get filteredRequests(): Solicitud[] {
    if (this.filterEstado === 'todos') {
      return this.solicitudes;
    }
    return this.solicitudes.filter(s => s.estado === this.filterEstado);
  }
}

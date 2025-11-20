import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Laboratorio {
  id: number;
  nombre: string;
  ubicacion: string;
  contacto?: string;
  estado?: 'Activo' | 'Inactivo' | 'Pendiente';
}
@Component({
  selector: 'app-listado-labs',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './listado-labs.html',
  styleUrl: './listado-labs.scss',
})
export default class ListadoLabs {

    laboratorios: Laboratorio[] = [
    { id: 1, nombre: 'Lab Central', ubicacion: 'Santiago' },
    { id: 2, nombre: 'Lab Norte', ubicacion: 'Antofagasta' },
    { id: 3, nombre: 'Lab Sur', ubicacion: 'Concepción' }
  ];

}

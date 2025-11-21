import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Laboratorios, Laboratorio } from '../../../core/services/laboratorios';

@Component({
  selector: 'app-listado-labs',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listado-labs.html',
  styleUrl: './listado-labs.scss',
})
export default class ListadoLabs implements OnInit {
  private laboratoriosService = inject(Laboratorios);
  
  laboratorios: Laboratorio[] = [];
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
}

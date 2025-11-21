import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiposAnalisisService, TipoAnalisis } from '../../../core/services/tipos-analisis';
import AgregarTipoAnalisis from '../agregar-tipo-analisis/agregar-tipo-analisis';

@Component({
  selector: 'app-tipos-analisis',
  imports: [CommonModule, RouterLink, AgregarTipoAnalisis],
  templateUrl: './tipos-analisis.html',
  styleUrl: './tipos-analisis.scss',
})
export default class TiposAnalisis implements OnInit {
  @ViewChild(AgregarTipoAnalisis) modalTipo!: AgregarTipoAnalisis;
  
  private tiposAnalisisService = inject(TiposAnalisisService);

  tiposAnalisis: TipoAnalisis[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.cargarTiposAnalisis();
  }

  cargarTiposAnalisis() {
    this.isLoading = true;
    this.error = null;

    this.tiposAnalisisService.getTiposAnalisis().subscribe({
      next: (tipos) => {
        this.tiposAnalisis = tipos;
        this.isLoading = false;
        console.log('Tipos de análisis cargados:', tipos);
      },
      error: (error) => {
        console.error('Error al cargar tipos de análisis:', error);
        this.error = 'Error al cargar los tipos de análisis. Por favor, intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  abrirModalAgregar() {
    this.modalTipo.modo = 'crear';
    this.modalTipo.tipoAnalisis = undefined;
    this.modalTipo.abrir();
  }

  onTipoGuardado() {
    console.log('Tipo guardado, recargando lista...');
    this.cargarTiposAnalisis();
  }
}

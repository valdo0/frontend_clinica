import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TiposAnalisisService, TipoAnalisis, TipoAnalisisDTO } from '../../../core/services/tipos-analisis';

@Component({
  selector: 'app-tipos-analisis',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tipos-analisis.html',
  styleUrl: './tipos-analisis.scss',
})
export default class TiposAnalisis implements OnInit {
  private tiposAnalisisService = inject(TiposAnalisisService);

  tiposAnalisis: TipoAnalisis[] = [];
  isLoading = false;
  error: string | null = null;

  // Form fields
  nombre = '';
  descripcion = '';
  isSaving = false;
  mostrarFormulario = false;

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

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.resetForm();
    }
  }

  resetForm() {
    this.nombre = '';
    this.descripcion = '';
  }

  crearTipoAnalisis(form: NgForm) {
    if (form.valid) {
      this.isSaving = true;
      this.error = null;

      const data: TipoAnalisisDTO = {
        nombre: this.nombre,
        descripcion: this.descripcion
      };

      this.tiposAnalisisService.createTipoAnalisis(data).subscribe({
        next: () => {
          console.log('Tipo de análisis creado exitosamente');
          this.isSaving = false;
          this.resetForm();
          form.reset();
          this.mostrarFormulario = false;
          this.cargarTiposAnalisis();
        },
        error: (error) => {
          console.error('Error al crear tipo de análisis:', error);
          this.error = 'Error al crear el tipo de análisis. Por favor, intente nuevamente.';
          this.isSaving = false;
        }
      });
    }
  }
}

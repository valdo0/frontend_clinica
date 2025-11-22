import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TiposAnalisisService } from '../../../core/services/tipos-analisis';
import { TipoAnalisis, TipoAnalisisDTO } from '../../../core/models';

@Component({
  selector: 'app-agregar-tipo-analisis',
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-tipo-analisis.html',
  styleUrl: './agregar-tipo-analisis.scss',
})
export default class AgregarTipoAnalisis {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() tipoAnalisis?: TipoAnalisis;
  @Output() tipoGuardado = new EventEmitter<void>();

  private tiposAnalisisService = inject(TiposAnalisisService);
  
  isModalOpen = false;
  
  nombre = '';
  descripcion = '';
  
  isLoading = false;
  error: string | null = null;

  abrir() {
    if (this.modo === 'editar' && this.tipoAnalisis) {
      this.nombre = this.tipoAnalisis.nombre;
      this.descripcion = this.tipoAnalisis.descripcion;
    } else {
      this.resetForm();
    }
    
    this.error = null;
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  cerrar() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  resetForm() {
    this.nombre = '';
    this.descripcion = '';
  }

  guardarTipo(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.error = null;

      const data: TipoAnalisisDTO = {
        nombre: this.nombre,
        descripcion: this.descripcion
      };

      const request = this.modo === 'crear'
        ? this.tiposAnalisisService.createTipoAnalisis(data)
        : this.tiposAnalisisService.createTipoAnalisis(data);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.cerrar();
          this.tipoGuardado.emit();
          this.resetForm();
          form.reset();
        },
        error: (error) => {
          console.error('Error al guardar tipo de análisis:', error);
          this.error = 'Error al guardar el tipo de análisis. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }
}

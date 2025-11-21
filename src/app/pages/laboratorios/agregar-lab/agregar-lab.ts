import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Laboratorios, Laboratorio, LaboratorioDTO } from '../../../core/services/laboratorios';
import { TiposAnalisisService, TipoAnalisis } from '../../../core/services/tipos-analisis';

@Component({
  selector: 'app-agregar-lab',
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-lab.html',
  styleUrl: './agregar-lab.scss',
})
export default class AgregarLab implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() laboratorio?: Laboratorio;
  @Output() laboratorioGuardado = new EventEmitter<void>();

  private laboratoriosService = inject(Laboratorios);
  private tiposAnalisisService = inject(TiposAnalisisService);
  
  // Modal state
  isModalOpen = false;
  
  // Form fields
  nombre = '';
  direccion = '';
  telefono = '';
  habilitado = true;
  tiposAnalisisSeleccionados: number[] = [];
  
  // Data for selects
  tiposAnalisisDisponibles: TipoAnalisis[] = [];
  
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.cargarTiposAnalisis();
  }

  cargarTiposAnalisis() {
    this.tiposAnalisisService.getTiposAnalisis().subscribe({
      next: (tipos) => {
        this.tiposAnalisisDisponibles = tipos;
      },
      error: (error) => {
        console.error('Error al cargar tipos de análisis:', error);
      }
    });
  }

  abrir() {
    if (this.modo === 'editar' && this.laboratorio) {
      this.nombre = this.laboratorio.nombre;
      this.direccion = this.laboratorio.direccion;
      this.telefono = this.laboratorio.telefono;
      this.habilitado = this.laboratorio.habilitado;
      this.tiposAnalisisSeleccionados = this.laboratorio.tiposAnalisis.map(t => t.id);
    } else {
      this.resetForm();
    }
    
    this.error = null;
    this.isModalOpen = true;
    // Prevent body scroll when modal is open
    document.body.classList.add('modal-open');
  }

  cerrar() {
    this.isModalOpen = false;
    // Restore body scroll
    document.body.classList.remove('modal-open');
  }

  resetForm() {
    this.nombre = '';
    this.direccion = '';
    this.telefono = '';
    this.habilitado = true;
    this.tiposAnalisisSeleccionados = [];
  }

  guardarLaboratorio(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.error = null;

      const data: LaboratorioDTO = {
        nombre: this.nombre,
        direccion: this.direccion,
        telefono: this.telefono,
        habilitado: this.habilitado,
        tiposAnalisisIds: this.tiposAnalisisSeleccionados
      };

      const request = this.modo === 'crear'
        ? this.laboratoriosService.createLaboratorio(data)
        : this.laboratoriosService.updateLaboratorio(this.laboratorio!.id, data);

      request.subscribe({
        next: () => {
          this.isLoading = false;
          this.cerrar();
          this.laboratorioGuardado.emit();
          this.resetForm();
          form.reset();
        },
        error: (error) => {
          console.error('Error al guardar laboratorio:', error);
          this.error = 'Error al guardar el laboratorio. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
    }
  }

  toggleTipoAnalisis(tipoId: number) {
    const index = this.tiposAnalisisSeleccionados.indexOf(tipoId);
    if (index === -1) {
      this.tiposAnalisisSeleccionados.push(tipoId);
    } else {
      this.tiposAnalisisSeleccionados.splice(index, 1);
    }
  }

  isTipoSeleccionado(tipoId: number): boolean {
    return this.tiposAnalisisSeleccionados.includes(tipoId);
  }

  onBackdropClick(event: MouseEvent) {
    // Close modal only if clicking on the backdrop itself, not its children
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }
}

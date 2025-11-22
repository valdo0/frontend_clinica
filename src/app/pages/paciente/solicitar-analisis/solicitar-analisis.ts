import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalisisService } from '../../../core/services/analisis';
import { Laboratorios } from '../../../core/services/laboratorios';
import { AnalisisRequestDTO, Laboratorio, TipoAnalisis } from '../../../core/models';
import { Auth } from '../../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-analisis.html',
  styleUrl: './solicitar-analisis.scss'
})
export default class SolicitarAnalisis implements OnInit {
  laboratorioId: number | null = null;
  tipoAnalisisId: number | null = null;
  descripcion: string = '';
  
  laboratorios: Laboratorio[] = [];
  isLoading = false;

  private analisisService = inject(AnalisisService);
  private laboratoriosService = inject(Laboratorios);
  private authService = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    this.loadLaboratorios();
  }

  loadLaboratorios() {
    this.laboratoriosService.getLaboratorios().subscribe({
      next: (labs) => {
        console.log('Laboratorios received:', labs);
        this.laboratorios = labs.filter(lab => lab.habilitado);
        console.log('Filtered laboratorios:', this.laboratorios);
      },
      error: (err) => {
        console.error('Error loading laboratorios:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los laboratorios.',
          timer: 2000
        });
      }
    });
  }

  get selectedLaboratorio(): Laboratorio | undefined {
    const selectedId = this.laboratorioId !== null ? Number(this.laboratorioId) : null;
    const selected = this.laboratorios.find(lab => lab.id === selectedId);
    console.log('Selected laboratorio (ID:', selectedId, '):', selected);
    return selected;
  }

  get availableTiposAnalisis(): TipoAnalisis[] {
    const tipos = this.selectedLaboratorio?.tiposAnalisis || [];
    console.log('Available tipos:', tipos);
    return tipos;
  }

  onLaboratorioChange() {
    const tipoExists = this.availableTiposAnalisis.some(
      tipo => tipo.id === this.tipoAnalisisId
    );
    
    if (!tipoExists) {
      this.tipoAnalisisId = null;
    }
  }

  onSubmit() {
    const user = this.authService.getUser();
    
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar al usuario.',
      });
      return;
    }

    if (!this.laboratorioId || !this.tipoAnalisisId) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor selecciona un laboratorio y tipo de análisis.',
      });
      return;
    }

    this.isLoading = true;

    const request: AnalisisRequestDTO = {
      laboratorioId: this.laboratorioId,
      tipoAnalisisId: this.tipoAnalisisId,
      usuarioId: user.id,
      descripcion: this.descripcion || undefined
    };

    this.analisisService.create(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Solicitud creada!',
          text: 'Tu solicitud de análisis ha sido registrada exitosamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/paciente/mis-solicitudes']);
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating analysis:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la solicitud. Intenta nuevamente.',
        });
      }
    });
  }

  resetForm() {
    this.laboratorioId = null;
    this.tipoAnalisisId = null;
    this.descripcion = '';
  }
}

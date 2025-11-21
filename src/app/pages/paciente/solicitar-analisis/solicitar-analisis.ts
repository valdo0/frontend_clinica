import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitar-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-analisis.html',
  styleUrl: './solicitar-analisis.scss'
})
export default class SolicitarAnalisis {
  tipoAnalisis: string = '';
  descripcion: string = '';

  // Mock data for analysis types
  tiposAnalisis: string[] = [
    'Hemograma Completo',
    'Perfil Lipídico',
    'Glucosa en Ayunas',
    'Perfil Hepático',
    'Examen de Orina',
    'Prueba de Embarazo'
  ];

  onSubmit() {
    console.log('Solicitud enviada:', {
      tipoAnalisis: this.tipoAnalisis,
      descripcion: this.descripcion,
      fecha: new Date()
    });
    alert('Solicitud de análisis creada exitosamente (Simulación)');
    this.resetForm();
  }

  resetForm() {
    this.tipoAnalisis = '';
    this.descripcion = '';
  }
}

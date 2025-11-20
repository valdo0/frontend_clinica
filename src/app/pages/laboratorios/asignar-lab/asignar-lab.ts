import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule ,NgForm} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-asignar-lab',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './asignar-lab.html',
  styleUrl: './asignar-lab.scss',
})
export default class AsignarLab {
  laboratorioSeleccionado = '';
  usuario = '';

  asignarLab(form: NgForm) {
    if (form.valid) {
      alert(`Laboratorio "${this.laboratorioSeleccionado}" asignado a "${this.usuario}"`);
      form.reset();
    }
  }

  laboratorios = ['Lab Central', 'Lab Norte', 'Lab Sur'];
  usuarios = ['Usuario 1', 'Usuario 2', 'Usuario 3'];
}

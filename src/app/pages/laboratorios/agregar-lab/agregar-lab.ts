import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule ,NgForm} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agregar-lab',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './agregar-lab.html',
  styleUrl: './agregar-lab.scss',
})
export default class AgregarLab {
  nombre = '';
  ubicacion = '';

  agregarLab(form: NgForm) {
    if (form.valid) {
      alert(`Laboratorio "${this.nombre}" agregado en "${this.ubicacion}"`);
      form.reset();
    }
  }
}

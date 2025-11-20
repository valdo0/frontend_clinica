import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend-clinica');
}

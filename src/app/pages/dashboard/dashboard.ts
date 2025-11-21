import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard {
  stats = [
    { title: 'Pacientes Hoy', value: 12, icon: 'bi-people', color: 'primary' },
    { title: 'Exámenes Pendientes', value: 5, icon: 'bi-hourglass-split', color: 'warning' },
    { title: 'Resultados Listos', value: 8, icon: 'bi-check-circle', color: 'success' },
    { title: 'Total del Mes', value: 145, icon: 'bi-calendar-check', color: 'info' },
  ];

  recentActivity = [
    { id: '1023', patient: 'Juan Pérez', exam: 'Hemograma Completo', status: 'Pendiente', time: '09:30 AM' },
    { id: '1022', patient: 'María González', exam: 'Perfil Lipídico', status: 'Completado', time: '09:15 AM' },
    { id: '1021', patient: 'Carlos López', exam: 'Glucosa en Ayunas', status: 'Procesando', time: '08:45 AM' },
    { id: '1020', patient: 'Ana Rodríguez', exam: 'Urocultivo', status: 'Completado', time: 'Yesterday' },
  ];
}

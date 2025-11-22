import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalisisService } from '../../core/services/analisis';
import { AnalisisResponseDTO, EstadoAnalisis } from '../../core/models';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

interface ActivityItem {
  id: string;
  patient: string;
  exam: string;
  status: EstadoAnalisis;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit {
  private analisisService = inject(AnalisisService);
  
  analisis: AnalisisResponseDTO[] = [];
  isLoading = true;
  stats: StatCard[] = [];
  recentActivity: ActivityItem[] = [];

  ngOnInit() {
    this.loadAnalisis();
  }

  loadAnalisis() {
    this.isLoading = true;
    this.analisisService.getAll().subscribe({
      next: (data) => {
        this.analisis = data;
        this.calculateStats();
        this.loadRecentActivity();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analisis:', err);
        this.isLoading = false;
        // Set default stats on error
        this.stats = [
          { title: 'Pacientes Hoy', value: 0, icon: 'bi-people', color: 'primary' },
          { title: 'Exámenes Pendientes', value: 0, icon: 'bi-hourglass-split', color: 'warning' },
          { title: 'Resultados Listos', value: 0, icon: 'bi-check-circle', color: 'success' },
          { title: 'Total del Mes', value: 0, icon: 'bi-calendar-check', color: 'info' },
        ];
      }
    });
  }

  calculateStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count pending exams
    const pendientes = this.analisis.filter(a => a.estado === 'PENDIENTE').length;

    // Count completed results
    const terminados = this.analisis.filter(a => a.estado === 'TERMINADO').length;

    // Count total this month
    const totalMes = this.analisis.filter(a => {
      const fecha = new Date(a.fechaSolicitud);
      return fecha >= firstDayOfMonth;
    }).length;

    // Count unique patients today
    const pacientesHoy = new Set(
      this.analisis
        .filter(a => {
          const fecha = new Date(a.fechaSolicitud);
          return fecha >= today;
        })
        .map(a => a.usuarioEmail)
    ).size;

    this.stats = [
      { title: 'Pacientes Hoy', value: pacientesHoy, icon: 'bi-people', color: 'primary' },
      { title: 'Exámenes Pendientes', value: pendientes, icon: 'bi-hourglass-split', color: 'warning' },
      { title: 'Resultados Listos', value: terminados, icon: 'bi-check-circle', color: 'success' },
      { title: 'Total del Mes', value: totalMes, icon: 'bi-calendar-check', color: 'info' },
    ];
  }

  loadRecentActivity() {
    // Sort by date descending and take the last 4
    const sorted = [...this.analisis].sort((a, b) => {
      return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime();
    });

    this.recentActivity = sorted.slice(0, 4).map(a => ({
      id: a.id.toString(),
      patient: a.usuarioNombre,
      exam: a.tipoAnalisisNombre,
      status: a.estado,
      time: this.formatDate(a.fechaSolicitud)
    }));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today) {
      return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    } else if (date >= yesterday) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';

// Bibliotecas para exportar PDF
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

// 1. Importe o serviço e a nova interface de dados
import { DashboardService } from '../../../core/services/dashboard.service';
import { IDashboardData, IChartData } from '../../../core/interfaces/dashboard/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatIconModule,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService]
})
export class DashboardComponent implements OnInit {

  dashboardData: IDashboardData | null = null;
  graficoVendasData: IChartData[] = [];
  produtosMaisVendidosData: IChartData[] = [];

  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.graficoVendasData = data.graficoVendas;
        this.produtosMaisVendidosData = data.produtosMaisVendidos;
      },
      error: (err) => {
        console.error('Erro ao buscar dados do dashboard:', err);
      }
    });
  }

  public exportarPDF(): void {
    const data = document.getElementById('dashboard-content');
    if (data) {
      html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('dashboard.pdf');
      });
    }
  }
}

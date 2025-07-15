import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts'; // 1. Importe o LegendPosition aqui
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service'; // Ajuste o caminho se necessário
import { MatIconModule } from '@angular/material/icon';

// Bibliotecas para exportar PDF
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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

  stats?: DashboardStats;
  graficoVendasData: any[] = [];
  produtosMaisVendidosData: any[] = [];

  // 2. Crie a propriedade para ser usada no template
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // Busca os dados dos cards
    this.dashboardService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });

    // Busca os dados dos gráficos
    this.dashboardService.getChartData().subscribe(data => {
      this.graficoVendasData = data.graficoVendas;
      this.produtosMaisVendidosData = data.produtosMaisVendidos;
    });
  }

  public exportarPDF(): void {
    // Seleciona o elemento que contém o conteúdo do dashboard
    const data = document.getElementById('dashboard-content');
    if (data) {
      html2canvas(data).then(canvas => {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('l', 'mm', 'a4'); // l = landscape (paisagem)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('dashboard.pdf');
      });
    }
  }
}
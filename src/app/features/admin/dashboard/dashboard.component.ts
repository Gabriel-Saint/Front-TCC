// import { Component, OnInit } from '@angular/core';
// import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
// import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
// import { MatIconModule } from '@angular/material/icon';

// import jspdf from 'jspdf';
// import html2canvas from 'html2canvas';


// import { DashboardService } from '../../../core/services/dashboard.service';
// import { IDashboardData, IChartData } from '../../../core/interfaces/dashboard/dashboard.interface';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     NgxChartsModule,
//     MatIconModule,
//     CurrencyPipe,
//     DecimalPipe
//   ],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
//   providers: [DashboardService]
// })
// export class DashboardComponent implements OnInit {

//   dashboardData: IDashboardData | null = null;
//   graficoVendasData: IChartData[] = [];
//   produtosMaisVendidosData: IChartData[] = [];

//   legendPosition: LegendPosition = LegendPosition.Below;

//   constructor(private dashboardService: DashboardService) { }

//   ngOnInit(): void {
//     this.dashboardService.getStats().subscribe({
//       next: (data) => {
//         this.dashboardData = data;
//         this.graficoVendasData = data.graficoVendas;
//         this.produtosMaisVendidosData = data.produtosMaisVendidos;
//       },
//       error: (err) => {
//         console.error('Erro ao buscar dados do dashboard:', err);
//       }
//     });
//   }

//   public exportarPDF(): void {
//     const data = document.getElementById('dashboard-content');
//     if (data) {
//       html2canvas(data).then(canvas => {
//         const contentDataURL = canvas.toDataURL('image/png');
//         const pdf = new jspdf('l', 'mm', 'a4');
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//         pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         pdf.save('dashboard.pdf');
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';

import jsPDF from 'jspdf';

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
  providers: [DashboardService, CurrencyPipe, DecimalPipe]
})
export class DashboardComponent implements OnInit {

  dashboardData: IDashboardData | null = null;
  graficoVendasData: IChartData[] = [];
  produtosMaisVendidosData: IChartData[] = [];
  legendPosition: LegendPosition = LegendPosition.Below;

  constructor(
    private dashboardService: DashboardService,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe
  ) { }

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
    if (!this.dashboardData) {
      alert('Os dados do dashboard ainda não foram carregados.');
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    let y = 20; 

  
    pdf.setFontSize(18);
    pdf.text("Resumo do Dashboard", 14, y);
    y += 15;

   
    pdf.setFontSize(14);
    pdf.text("Estatísticas Gerais", 14, y);
    y += 7;
    pdf.setFontSize(11);
    pdf.text(`Total de Vendas: ${this.currencyPipe.transform(this.dashboardData.totalVendas, 'BRL')}`, 14, y);
    y += 7;
    pdf.text(`Total de Pedidos: ${this.decimalPipe.transform(this.dashboardData.totalPedidos)}`, 14, y);
    y += 7;
    pdf.text(`Produtos Vendidos: ${this.decimalPipe.transform(this.dashboardData.produtosVendidos)}`, 14, y);
    y += 7;
    pdf.text(`Valor Médio de Vendas: ${this.currencyPipe.transform(this.dashboardData.valorMedioVendas, 'BRL')}`, 14, y);
    y += 15;


    pdf.setFontSize(14);
    pdf.text("Top 5 Produtos Mais Vendidos", 14, y);
    y += 7;
    pdf.setFontSize(11);
    this.dashboardData.produtosMaisVendidos.forEach(product => {
      pdf.text(`${product.name}: ${product.value} unidades`, 14, y);
      y += 7;
    });
    y += 8;


    pdf.setFontSize(14);
    pdf.text("Resumo de Vendas por Dia", 14, y);
    y += 7;
    pdf.setFontSize(11);
    this.dashboardData.graficoVendas.forEach(sale => {
      pdf.text(`${sale.name}: ${this.currencyPipe.transform(sale.value, 'BRL')}`, 14, y);
      y += 7;
    });

    pdf.save('resumo-dashboard.pdf');
  }
}


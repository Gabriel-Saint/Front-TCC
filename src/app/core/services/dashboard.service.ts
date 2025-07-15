import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' é para simular dados

// Interfaces para tipagem dos dados-- criar interface!!!!!!!!!!!!!!
export interface DashboardStats {
  totalVendas: number;
  totalPedidos: number;
  produtosVendidos: number;
  valorMedioVendas: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard'; // URL base da sua API

  constructor(private http: HttpClient) { }

  // Método para buscar os cards de estatísticas
  getDashboardStats(): Observable<DashboardStats> {
    // SIMULAÇÃO DE DADOS (para teste enquanto a API não está pronta)
    return of({
      totalVendas: 32540.50,
      totalPedidos: 1245,
      produtosVendidos: 1420,
      valorMedioVendas: 289.70
    });
  }

  // Método para buscar os dados dos gráficos
  getChartData(): Observable<any> {
    // CHAMADA REAL: return this.http.get<any>(`${this.apiUrl}/charts`);
    // SIMULAÇÃO DE DADOS
    return of({
      graficoVendas: [
        { name: 'Seg', value: 4500 },
        { name: 'Ter', value: 7200 },
        { name: 'Qua', value: 3800 },
        { name: 'Qui', value: 6900 },
        { name: 'Sex', value: 8100 },
      ],
      produtosMaisVendidos: [
        { name: 'Produto A', value: 500 },
        { name: 'Produto B', value: 350 },
        { name: 'Outros', value: 200 },
      ]
    });
  }
}
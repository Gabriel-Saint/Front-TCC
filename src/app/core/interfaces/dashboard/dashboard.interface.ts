
export interface IChartData {
  name: string;
  value: number;
}

export interface IDashboardData {
  totalVendas: number;
  totalPedidos: number;
  produtosVendidos: number;
  valorMedioVendas: number;
  produtosMaisVendidos: IChartData[];
  graficoVendas: IChartData[];
}

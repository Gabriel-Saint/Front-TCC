import { IPayment } from "../payment/payment.interface";

export interface IOrderItem {
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
}

export interface IOrder {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  customerNote?: string;
  status: 'Pendente' | 'Em Preparo' | 'Saiu para Entrega' | 'Concluído' | 'Cancelado' | string;
  orderDate: string; 
  orderDetails: IOrderItem[];
  payments: IPayment[]; 
}

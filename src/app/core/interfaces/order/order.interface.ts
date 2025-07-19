import { IPayment } from "../payment/payment.interface";
import { IProduct } from "../product/product.interface";

export interface IOrderItem {
  productId: number;
  quantity: number;
  product: IProduct;
}

export interface IOrderItemPayload {
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

export interface IOrderCreationResponse {
  order: IOrder;
}
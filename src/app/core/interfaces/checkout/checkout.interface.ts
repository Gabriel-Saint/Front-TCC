import { IOrderItemPayload } from "../order/order.interface";
import { IPaymentPayload } from "../payment/payment.interface";

export interface ICheckoutPayload {
  name: string;
  phone: string;
  deliveryType: 'Delivery' | 'Retirada';
  address?: string;
  cpf: string;
  customerNote?: string;
  items: IOrderItemPayload[];
  payment: IPaymentPayload;
}

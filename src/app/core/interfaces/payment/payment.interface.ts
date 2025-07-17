

export interface IPaymentPayload {
  type: 'Cash' | 'Card' | 'Pix' | string;
  deliveryFee?: number;
  subtotal: number;
  total: number;
  changeFor?: number;
}


export interface IPayment extends IPaymentPayload {
  id: number;
  orderId: number;
}
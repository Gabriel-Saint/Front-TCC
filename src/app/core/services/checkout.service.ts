import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IOrder, IOrderCreationResponse } from '../interfaces/order/order.interface';
import { ICheckoutPayload } from '../interfaces/checkout/checkout.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/checkout`;

  constructor(private http: HttpClient) { }

  /**
   * @param payload
   * @returns 
   */
  createOrder(payload: ICheckoutPayload): Observable<IOrderCreationResponse> {
    return this.http.post<IOrderCreationResponse>(this.apiUrl, payload);
  }
}

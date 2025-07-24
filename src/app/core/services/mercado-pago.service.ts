import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICheckoutPayload } from '../interfaces/checkout/checkout.interface';

export interface IMercadoPagoPreferenceResponse {
  checkoutUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = `${environment.apiUrl}/mercado-pago`;

  constructor(private http: HttpClient) { }

  createPreference(payload: ICheckoutPayload): Observable<IMercadoPagoPreferenceResponse> {
    return this.http.post<IMercadoPagoPreferenceResponse>(`${this.apiUrl}/create-preference`, payload);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


import { IDashboardData } from '../../core/interfaces/dashboard/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  /**
   * @returns Um Observable com todos os dados do dashboard.
   */
  getStats(): Observable<IDashboardData> {
    return this.http.get<IDashboardData>(`${this.apiUrl}/stats`);
  }
}

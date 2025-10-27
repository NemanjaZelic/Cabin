import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpsaStatistika } from '../modeli/zajednicko.model.js';
@Injectable({
  providedIn: 'root'
})
export class StatistikaService {
  private apiUrl = 'http://localhost:5000/api/stats';
  constructor(private http: HttpClient) { }
  getOpstuStatistiku(): Observable<{ success: boolean, data: OpsaStatistika }> {
    return this.http.get<any>(`${this.apiUrl}/general`);
  }
  getStatistikuVlasnika(vlasnikId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/owner/${vlasnikId}`);
  }
}

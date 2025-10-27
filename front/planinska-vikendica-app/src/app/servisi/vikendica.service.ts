import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vikendica, ParametriPretrage } from '../modeli/vikendica.model.js';
@Injectable({
  providedIn: 'root'
})
export class VikendicaService {
  private apiUrl = 'http://localhost:5000/api/cabins';
  constructor(private http: HttpClient) { }
  getSveVikendice(parametri?: ParametriPretrage): Observable<any> {
    let params = new HttpParams();
    if (parametri?.name) {
      params = params.set('name', parametri.name);
    }
    if (parametri?.place) {
      params = params.set('place', parametri.place);
    }
    if (parametri?.sortBy) {
      params = params.set('sortBy', parametri.sortBy);
    }
    if (parametri?.sortOrder) {
      params = params.set('sortOrder', parametri.sortOrder);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }
  getVikendicaPoId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  kreirajVikendicu(podaci: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, podaci);
  }
  azurirajVikendicu(id: string, podaci: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, podaci);
  }
  obrisiVikendicu(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  getVikendicePovlasniku(vlasnikId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/owner/${vlasnikId}`);
  }
  getMojeVikendice(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-cabins`);
  }
}

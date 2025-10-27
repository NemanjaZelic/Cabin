import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZahtevZaRezervaciju } from '../modeli/rezervacija.model.js';
@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {
  private apiUrl = 'http://localhost:5000/api/reservations';
  constructor(private http: HttpClient) { }
  kreirajRezervaciju(podaci: ZahtevZaRezervaciju): Observable<any> {
    return this.http.post<any>(this.apiUrl, podaci);
  }
  getTrenutneRezervacije(korisnikId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${korisnikId}/current`);
  }
  getArhiviraneRezervacije(korisnikId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${korisnikId}/archive`);
  }
  otkaziRezervaciju(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/cancel`, {});
  }
  getRezervacijeVlasnika(vlasnikId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/owner/${vlasnikId}`);
  }
  azurirajStatusRezervacije(id: string, status: string, razlogOdbijanja?: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, {
      status,
      rejectionReason: razlogOdbijanja
    });
  }
  getRezervacijeZaVlasnika(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-reservations`);
  }
  prihvatiRezervaciju(id: string): Observable<any> {
    return this.azurirajStatusRezervacije(id, 'confirmed');
  }
  odbijiRezervaciju(id: string, razlog: string): Observable<any> {
    return this.azurirajStatusRezervacije(id, 'rejected', razlog);
  }
}

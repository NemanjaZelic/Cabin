import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik } from '../modeli/korisnik.model';
@Injectable({
  providedIn: 'root'
})
export class KorisnikService {
  private apiUrl = 'http://localhost:5000/api/users';
  constructor(private http: HttpClient) { }
  getMojProfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }
  azurirajProfil(podaci: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, podaci);
  }
  promeniLozinku(podaci: { oldPassword: string, newPassword: string, confirmPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, podaci);
  }
  getKorisnikPoId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}

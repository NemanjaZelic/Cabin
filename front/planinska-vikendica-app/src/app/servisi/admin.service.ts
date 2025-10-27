import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api/admin';
  constructor(private http: HttpClient) { }
  getSviKorisnici(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
  getKorisniciNaCekanju(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pending-users`);
  }
  odobriKorisnika(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/approve`, {});
  }
  odbijKorisnika(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/reject`, {});
  }
  deaktivirajKorisnika(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/deactivate`, {});
  }
  aktivirajKorisnika(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/activate`, {});
  }
  azurirajKorisnika(id: string, podaci: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, podaci);
  }
  obrisiKorisnika(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }
  getSveVikendiceAdmin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cabins`);
  }
  blokirajVikendicu(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cabins/${id}/block`, {});
  }
}

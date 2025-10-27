import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KomentarService {
  private apiUrl = 'http://localhost:5000/api/comments';
  constructor(private http: HttpClient) { }
  getKomentariZaVikendicu(vikendicaId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cabin/${vikendicaId}`);
  }
  kreirajKomentar(podaci: {
    cabinId: string,
    reservationId: string,
    text: string,
    rating: number
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, podaci);
  }
}

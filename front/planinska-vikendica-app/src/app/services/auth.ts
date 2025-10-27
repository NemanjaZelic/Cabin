import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ZahtevZaPrijavu, ZahtevZaRegistraciju, OdgovorAutentifikacije, Korisnik } from '../modeli/korisnik.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private trenutniKorisnikSubject = new BehaviorSubject<Korisnik | null>(null);
  public trenutniKorisnik$ = this.trenutniKorisnikSubject.asObservable();
  constructor(private http: HttpClient) {
    this.ucitajKorisnikaIzMemorije();
  }
  private ucitajKorisnikaIzMemorije(): void {
    const token = localStorage.getItem('token');
    const korisnik = localStorage.getItem('korisnik');
    
    if (token && korisnik) {
      try {
        const korisnikObj = JSON.parse(korisnik);
        
        if (korisnikObj.id && !korisnikObj._id) {
          korisnikObj._id = korisnikObj.id;
          localStorage.setItem('korisnik', JSON.stringify(korisnikObj));
        }
        
        this.trenutniKorisnikSubject.next(korisnikObj);
      } catch (e) {
        console.error('Greška pri parsiranju korisnika:', e);
      }
    }
  }
  registracija(podaci: FormData): Observable<OdgovorAutentifikacije> {
    return this.http.post<OdgovorAutentifikacije>(`${this.apiUrl}/register`, podaci);
  }
  prijava(kredencijali: ZahtevZaPrijavu): Observable<OdgovorAutentifikacije> {
    return this.http.post<OdgovorAutentifikacije>(`${this.apiUrl}/login`, kredencijali).pipe(
      tap(odgovor => {
        if (odgovor.success && odgovor.token && odgovor.user) {
          localStorage.setItem('token', odgovor.token);
          localStorage.setItem('korisnik', JSON.stringify(odgovor.user));
          this.trenutniKorisnikSubject.next(odgovor.user);
        }
      })
    );
  }
  adminPrijava(kredencijali: ZahtevZaPrijavu): Observable<OdgovorAutentifikacije> {
    return this.http.post<OdgovorAutentifikacije>(`${this.apiUrl}/admin/login`, kredencijali).pipe(
      tap(odgovor => {
        if (odgovor.success && odgovor.token && odgovor.user) {
          localStorage.setItem('token', odgovor.token);
          localStorage.setItem('korisnik', JSON.stringify(odgovor.user));
          this.trenutniKorisnikSubject.next(odgovor.user);
        }
      })
    );
  }
  odjava(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnik');
    this.trenutniKorisnikSubject.next(null);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  jeAutentifikovan(): boolean {
    return !!this.getToken();
  }
  getTrenutnogKorisnika(): Korisnik | null {
    return this.trenutniKorisnikSubject.value;
  }
  getUlogaKorisnika(): string {
    const korisnik = this.getTrenutnogKorisnika();
    return korisnik?.role || '';
  }
}

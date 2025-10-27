import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RezervacijaService } from '../../../servisi/rezervacija.service';
import { AuthService } from '../../../services/auth';
import { Rezervacija } from '../../../modeli/rezervacija.model.js';
@Component({
  selector: 'app-turista-rezervacije',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turista-rezervacije.html',
  styleUrls: ['./turista-rezervacije.css']
})
export class TuristaRezervacijeComponent implements OnInit {
  trenutneRezervacije: Rezervacija[] = [];
  arhiviraneRezervacije: Rezervacija[] = [];
  aktivniTab: 'trenutne' | 'arhivirane' = 'trenutne';
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  constructor(
    private rezervacijaService: RezervacijaService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
    const korisnik = this.authService.getTrenutnogKorisnika();
    if (korisnik && korisnik._id) {
      this.ucitajRezervacije(korisnik._id);
    } else {
      this.ucitavanje = false;
      this.greska = 'Morate biti ulogovani da biste videli rezervacije';
    }
  }
  ucitajRezervacije(korisnikId: string) {
    this.ucitavanje = true;
    this.greska = '';
    
    forkJoin({
      trenutne: this.rezervacijaService.getTrenutneRezervacije(korisnikId),
      arhivirane: this.rezervacijaService.getArhiviraneRezervacije(korisnikId)
    }).subscribe({
      next: (results) => {
        this.trenutneRezervacije = results.trenutne.data || [];
        this.arhiviraneRezervacije = results.arhivirane.data || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri učitavanju rezervacija';
        this.ucitavanje = false;
      }
    });
  }
  otkaziRezervaciju(rezervacija: Rezervacija) {
    if (!confirm('Da li ste sigurni da želite da otkažete ovu rezervaciju?')) {
      return;
    }
    this.rezervacijaService.otkaziRezervaciju(rezervacija._id!).subscribe({
      next: (response) => {
        this.poruka = 'Rezervacija uspešno otkazana';
        const korisnik = this.authService.getTrenutnogKorisnika();
        if (korisnik && korisnik._id) {
          this.ucitajRezervacije(korisnik._id);
        }
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri otkazivanju rezervacije';
      }
    });
  }
  getStatusBoja(status: string): string {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      case 'cancelled': return 'gray';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  }
  getStatusTekst(status: string): string {
    switch (status) {
      case 'confirmed': return 'Potvrđeno';
      case 'pending': return 'Na čekanju';
      case 'rejected': return 'Odbijeno';
      case 'cancelled': return 'Otkazano';
      case 'completed': return 'Završeno';
      default: return status;
    }
  }
  mozeOtkazati(rezervacija: Rezervacija): boolean {
    return rezervacija.status === 'pending' || rezervacija.status === 'confirmed';
  }
  prikaziVikendicu(cabinId: string) {
    this.router.navigate(['/turista/vikendica', cabinId]);
  }
}

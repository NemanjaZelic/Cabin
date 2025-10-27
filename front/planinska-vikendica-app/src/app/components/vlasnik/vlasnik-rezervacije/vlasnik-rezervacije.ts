import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RezervacijaService } from '../../../servisi/rezervacija.service';
import { Rezervacija } from '../../../modeli/rezervacija.model.js';
@Component({
  selector: 'app-vlasnik-rezervacije',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vlasnik-rezervacije.html',
  styleUrls: ['./vlasnik-rezervacije.css']
})
export class VlasnikRezervacijeComponent implements OnInit {
  rezervacije: Rezervacija[] = [];
  aktivniTab: 'pending' | 'confirmed' | 'all' = 'pending';
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  razlogOdbijanja: string = '';
  odbijaRezervacijuId: string | null = null;
  constructor(
    private rezervacijaService: RezervacijaService,
    private router: Router
  ) {}
  ngOnInit() {
    this.ucitajRezervacije();
  }
  ucitajRezervacije() {
    this.ucitavanje = true;
    this.greska = '';
    this.rezervacijaService.getRezervacijeZaVlasnika().subscribe({
      next: (response) => {
        this.rezervacije = response.data || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju rezervacija';
        this.ucitavanje = false;
      }
    });
  }
  getFilteredRezervacije(): Rezervacija[] {
    if (this.aktivniTab === 'all') {
      return this.rezervacije;
    }
    return this.rezervacije.filter(rez => rez.status === this.aktivniTab);
  }
  prihvatiRezervaciju(rezervacija: Rezervacija) {
    if (!confirm('Da li ste sigurni da želite da prihvatite ovu rezervaciju?')) {
      return;
    }
    this.rezervacijaService.prihvatiRezervaciju(rezervacija._id!).subscribe({
      next: (response) => {
        this.poruka = 'Rezervacija uspešno prihvaćena';
        this.ucitajRezervacije();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri prihvatanju rezervacije';
      }
    });
  }
  prikaziFormuZaOdbijanje(rezervacijaId: string) {
    this.odbijaRezervacijuId = rezervacijaId;
    this.razlogOdbijanja = '';
  }
  otkaziOdbijanje() {
    this.odbijaRezervacijuId = null;
    this.razlogOdbijanja = '';
  }
  odbijiRezervaciju(rezervacija: Rezervacija) {
    if (!this.razlogOdbijanja.trim()) {
      this.greska = 'Morate uneti razlog odbijanja';
      return;
    }
    this.rezervacijaService.odbijiRezervaciju(rezervacija._id!, this.razlogOdbijanja).subscribe({
      next: (response) => {
        this.poruka = 'Rezervacija uspešno odbijena';
        this.odbijaRezervacijuId = null;
        this.razlogOdbijanja = '';
        this.ucitajRezervacije();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri odbijanju rezervacije';
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
  mozePrihvatiti(rezervacija: Rezervacija): boolean {
    return rezervacija.status === 'pending';
  }
  mozeOdbiti(rezervacija: Rezervacija): boolean {
    return rezervacija.status === 'pending';
  }
  prikaziVikendicu(cabinId: string) {
    this.router.navigate(['/turista/vikendica', cabinId]);
  }
  getBrojPendingRezervacija(): number {
    return this.rezervacije.filter(r => r.status === 'pending').length;
  }
  getBrojConfirmedRezervacija(): number {
    return this.rezervacije.filter(r => r.status === 'confirmed').length;
  }
}

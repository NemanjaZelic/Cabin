import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../servisi/admin.service';
import { Korisnik } from '../../../modeli/korisnik.model.js';
@Component({
  selector: 'app-admin-korisnici',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-korisnici.html',
  styleUrls: ['./admin-korisnici.css']
})
export class AdminKorisniciComponent implements OnInit {
  korisnici: Korisnik[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  constructor(private adminService: AdminService) {}
  ngOnInit() {
    this.ucitajKorisnike();
  }
  ucitajKorisnike() {
    this.ucitavanje = true;
    this.greska = '';
    this.adminService.getSviKorisnici().subscribe({
      next: (response) => {
        this.korisnici = response.data || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju korisnika';
        this.ucitavanje = false;
      }
    });
  }
  aktivirajKorisnika(korisnik: Korisnik) {
    if (!confirm(`Da li želite da aktivirate korisnika ${korisnik.username}?`)) {
      return;
    }
    this.adminService.aktivirajKorisnika(korisnik._id!).subscribe({
      next: () => {
        this.poruka = 'Korisnik uspešno aktiviran';
        this.ucitajKorisnike();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri aktiviranju korisnika';
      }
    });
  }
  deaktivirajKorisnika(korisnik: Korisnik) {
    if (!confirm(`Da li želite da deaktivirate korisnika ${korisnik.username}?`)) {
      return;
    }
    this.adminService.deaktivirajKorisnika(korisnik._id!).subscribe({
      next: () => {
        this.poruka = 'Korisnik uspešno deaktiviran';
        this.ucitajKorisnike();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri deaktiviranju korisnika';
      }
    });
  }
  getStatusBoja(status: string): string {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      case 'deactivated': return 'gray';
      default: return 'gray';
    }
  }
  getStatusTekst(status: string): string {
    switch (status) {
      case 'active': return 'Aktivan';
      case 'pending': return 'Na čekanju';
      case 'rejected': return 'Odbijen';
      case 'deactivated': return 'Deaktiviran';
      default: return status;
    }
  }
  getUlogaTekst(role: string): string {
    switch (role) {
      case 'turista': return 'Turista';
      case 'vlasnik': return 'Vlasnik';
      case 'admin': return 'Administrator';
      default: return role;
    }
  }
}

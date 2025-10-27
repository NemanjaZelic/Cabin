import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../servisi/admin.service';
import { Korisnik } from '../../../modeli/korisnik.model.js';
@Component({
  selector: 'app-admin-zahtevi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-zahtevi.html',
  styleUrls: ['./admin-zahtevi.css']
})
export class AdminZahteviComponent implements OnInit {
  zahtevi: Korisnik[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  constructor(private adminService: AdminService) {}
  ngOnInit() {
    this.ucitajZahteve();
  }
  ucitajZahteve() {
    this.ucitavanje = true;
    this.greska = '';
    this.adminService.getKorisniciNaCekanju().subscribe({
      next: (response) => {
        this.zahtevi = response.data || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju zahteva';
        this.ucitavanje = false;
      }
    });
  }
  odobri(korisnik: Korisnik) {
    if (!confirm(`Da li želite da odobrite registraciju za korisnika ${korisnik.username}?`)) {
      return;
    }
    this.adminService.odobriKorisnika(korisnik._id!).subscribe({
      next: () => {
        this.poruka = 'Korisnik uspešno odobren';
        this.ucitajZahteve();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri odobravanju korisnika';
      }
    });
  }
  odbij(korisnik: Korisnik) {
    if (!confirm(`Da li želite da odbijete registraciju za korisnika ${korisnik.username}?`)) {
      return;
    }
    this.adminService.odbijKorisnika(korisnik._id!).subscribe({
      next: () => {
        this.poruka = 'Korisnik odbijen';
        this.ucitajZahteve();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri odbijanju korisnika';
      }
    });
  }
  getUlogaTekst(role: string): string {
    switch (role) {
      case 'turista': return 'Turista';
      case 'vlasnik': return 'Vlasnik';
      case 'admin': return 'Administrator';
      default: return role;
    }
  }
  getProfilnaSlika(korisnik: Korisnik): string {
    if (korisnik.profileImage) {
      return korisnik.profileImage;
    }
    return 'assets/default-avatar.png';
  }
}

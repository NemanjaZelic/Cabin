import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KorisnikService } from '../../../servisi/korisnik.service';
import { AuthService } from '../../../services/auth';
import { Korisnik } from '../../../modeli/korisnik.model.js';
@Component({
  selector: 'app-vlasnik-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vlasnik-profil.html',
  styleUrls: ['./vlasnik-profil.css']
})
export class VlasnikProfilComponent implements OnInit {
  korisnik: Korisnik = {} as Korisnik;
  aktivniTab: 'pregled' | 'izmena' | 'promena-lozinke' = 'pregled';
  imePrezime: string = '';
  email: string = '';
  adresa: string = '';
  telefon: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  staraLozinka: string = '';
  novaLozinka: string = '';
  potvrdaLozinke: string = '';
  poruka: string = '';
  greska: string = '';
  ucitavanje: boolean = false;
  constructor(
    private korisnikService: KorisnikService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.ucitajProfil();
  }
  ucitajProfil() {
    this.ucitavanje = true;
    this.korisnikService.getMojProfil().subscribe({
      next: (response) => {
        this.korisnik = response.data;
        this.popuniFormu();
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju profila';
        this.ucitavanje = false;
      }
    });
  }
  popuniFormu() {
    this.imePrezime = `${this.korisnik.firstName || ''} ${this.korisnik.lastName || ''}`.trim();
    this.email = this.korisnik.email || '';
    this.adresa = this.korisnik.address || '';
    this.telefon = this.korisnik.phone || '';
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.greska = 'Slika ne sme biti veća od 2MB';
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }
  sacuvajIzmene() {
    this.poruka = '';
    this.greska = '';
    const formData = new FormData();
    formData.append('name', this.imePrezime);
    formData.append('email', this.email);
    formData.append('address', this.adresa);
    formData.append('phone', this.telefon);
    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }
    this.ucitavanje = true;
    this.korisnikService.azurirajProfil(formData).subscribe({
      next: (response) => {
        this.poruka = 'Profil uspešno ažuriran';
        this.korisnik = response.data;
        this.selectedFile = null;
        this.selectedFileName = '';
        this.aktivniTab = 'pregled';
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri ažuriranju profila';
        this.ucitavanje = false;
      }
    });
  }
  promeniLozinku() {
    this.poruka = '';
    this.greska = '';
    if (!this.staraLozinka || !this.novaLozinka || !this.potvrdaLozinke) {
      this.greska = 'Sva polja su obavezna';
      return;
    }
    if (this.novaLozinka !== this.potvrdaLozinke) {
      this.greska = 'Lozinke se ne poklapaju';
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z][A-Za-z\d@$!%*?&#]{5,9}$/;
    if (!passwordRegex.test(this.novaLozinka)) {
      this.greska = 'Lozinka mora početi slovom, sadržati 6-10 karaktera, barem jedno veliko slovo, 3 mala, 1 broj i 1 specijalni karakter';
      return;
    }
    this.ucitavanje = true;
    this.korisnikService.promeniLozinku({
      oldPassword: this.staraLozinka,
      newPassword: this.novaLozinka,
      confirmPassword: this.potvrdaLozinke
    }).subscribe({
      next: (response) => {
        this.poruka = 'Lozinka uspešno promenjena';
        this.staraLozinka = '';
        this.novaLozinka = '';
        this.potvrdaLozinke = '';
        this.aktivniTab = 'pregled';
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri promeni lozinke';
        this.ucitavanje = false;
      }
    });
  }
  getProfilnaSlika(): string {
    if (this.korisnik.profileImage) {
      return this.korisnik.profileImage;
    }
    return 'assets/default-avatar.png';
  }
  otkaziIzmenu() {
    this.popuniFormu();
    this.selectedFile = null;
    this.selectedFileName = '';
    this.greska = '';
    this.aktivniTab = 'pregled';
  }
  otkaziPromenuLozinke() {
    this.staraLozinka = '';
    this.novaLozinka = '';
    this.potvrdaLozinke = '';
    this.greska = '';
    this.aktivniTab = 'pregled';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { KorisnikService } from '../../../servisi/korisnik.service';
import { Korisnik } from '../../../modeli/korisnik.model.js';
@Component({
  selector: 'app-turista-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turista-profil.html',
  styleUrls: ['./turista-profil.css']
})
export class TuristaProfilComponent implements OnInit {
  korisnik: Korisnik | null = null;
  ucitavanje: boolean = true;
  mod: 'pregled' | 'izmena' | 'promena-lozinke' = 'pregled';
  ime: string = '';
  prezime: string = '';
  adresa: string = '';
  telefon: string = '';
  email: string = '';
  novaProfilnaSlika: File | null = null;
  novaProfilnaSlikaPreview: string | null = null;
  staraLozinka: string = '';
  novaLozinka: string = '';
  potvrdaLozinke: string = '';
  poruka: string = '';
  greska: string = '';
  cuvanje: boolean = false;
  constructor(
    private authService: AuthService,
    private korisnikService: KorisnikService,
    private router: Router
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
    if (this.korisnik) {
      this.ime = this.korisnik.firstName;
      this.prezime = this.korisnik.lastName;
      this.adresa = this.korisnik.address;
      this.telefon = this.korisnik.phone;
      this.email = this.korisnik.email;
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.greska = 'Molimo odaberite sliku (JPG ili PNG)';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.greska = 'Slika ne sme biti veća od 2MB';
        return;
      }
      this.novaProfilnaSlika = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.novaProfilnaSlikaPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.greska = '';
    }
  }
  sacuvajIzmene() {
    this.greska = '';
    this.poruka = '';
    if (!this.ime || !this.prezime || !this.adresa || !this.telefon || !this.email) {
      this.greska = 'Sva polja su obavezna';
      return;
    }
    const formData = new FormData();
    formData.append('firstName', this.ime);
    formData.append('lastName', this.prezime);
    formData.append('address', this.adresa);
    formData.append('phone', this.telefon);
    formData.append('email', this.email);
    if (this.novaProfilnaSlika) {
      formData.append('profileImage', this.novaProfilnaSlika);
    }
    this.cuvanje = true;
    this.korisnikService.azurirajProfil(formData).subscribe({
      next: (response) => {
        this.cuvanje = false;
        this.poruka = 'Profil uspešno ažuriran!';
        this.ucitajProfil();
        this.mod = 'pregled';
        this.novaProfilnaSlika = null;
        this.novaProfilnaSlikaPreview = null;
      },
      error: (err) => {
        this.cuvanje = false;
        this.greska = err.error?.message || 'Greška pri ažuriranju profila';
      }
    });
  }
  promeniLozinku() {
    this.greska = '';
    this.poruka = '';
    if (!this.staraLozinka || !this.novaLozinka || !this.potvrdaLozinke) {
      this.greska = 'Sva polja su obavezna';
      return;
    }
    if (this.novaLozinka !== this.potvrdaLozinke) {
      this.greska = 'Nove lozinke se ne poklapaju';
      return;
    }
    const regex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z][A-Za-z\d@$!%*?&#]{5,9}$/;
    if (!regex.test(this.novaLozinka)) {
      this.greska = 'Nova lozinka ne zadovoljava uslove (počinje slovom, 6-10 karaktera, 1 veliko, 3 mala, 1 broj, 1 specijalni)';
      return;
    }
    this.cuvanje = true;
    this.korisnikService.promeniLozinku({
      oldPassword: this.staraLozinka,
      newPassword: this.novaLozinka,
      confirmPassword: this.potvrdaLozinke
    }).subscribe({
      next: (response) => {
        this.cuvanje = false;
        this.poruka = 'Lozinka uspešno promenjena!';
        this.staraLozinka = '';
        this.novaLozinka = '';
        this.potvrdaLozinke = '';
        this.mod = 'pregled';
      },
      error: (err) => {
        this.cuvanje = false;
        this.greska = err.error?.message || 'Greška pri promeni lozinke';
      }
    });
  }
  otkaziIzmene() {
    this.mod = 'pregled';
    this.popuniFormu();
    this.novaProfilnaSlika = null;
    this.novaProfilnaSlikaPreview = null;
    this.staraLozinka = '';
    this.novaLozinka = '';
    this.potvrdaLozinke = '';
    this.greska = '';
    this.poruka = '';
  }
  getProfilnaSlika(): string {
    if (this.korisnik?.profileImage) {
      return this.korisnik.profileImage;
    }
    return 'assets/default-profile.png';
  }
}

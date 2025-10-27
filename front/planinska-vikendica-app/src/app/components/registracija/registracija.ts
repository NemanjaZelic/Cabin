import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registracija.html',
  styleUrl: './registracija.css',
})
export class Registracija {
  tipKorisnika: 'turista' | 'vlasnik' = 'turista';
  korisnickoIme: string = '';
  lozinka: string = '';
  potvrdaLozinke: string = '';
  ime: string = '';
  prezime: string = '';
  pol: string = 'M';
  adresa: string = '';
  telefon: string = '';
  email: string = '';
  profilnaSlika: File | null = null;
  profilnaSlikaPreview: string | null = null;
  brojKreditneKartice: string = '';
  bezbedonosnoPitanje: string = '';
  odgovorNaPitanje: string = '';
  poruka: string = '';
  greska: string = '';
  ucitavanje: boolean = false;
  validacijaKorisnickoIme: string = '';
  validacijaLozinka: string = '';
  validacijaKreditnaKartica: string = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
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
      this.profilnaSlika = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilnaSlikaPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.greska = '';
    }
  }
  validateKorisnickoIme() {
    if (this.korisnickoIme.length < 3) {
      this.validacijaKorisnickoIme = 'Korisničko ime mora imati najmanje 3 karaktera';
    } else {
      this.validacijaKorisnickoIme = '';
    }
  }
  validateLozinka() {
    const regex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z][A-Za-z\d@$!%*?&#]{5,9}$/;
    if (!regex.test(this.lozinka)) {
      this.validacijaLozinka = 'Lozinka mora: početi slovom, 6-10 karaktera, 1 veliko slovo, 3 mala slova, 1 broj, 1 specijalni karakter (@$!%*?&#)';
    } else {
      this.validacijaLozinka = '';
    }
  }
  validateKreditnaKartica() {
    if (!this.brojKreditneKartice) {
      this.validacijaKreditnaKartica = '';
      return;
    }
    const kartica = this.brojKreditneKartice.replace(/\s/g, '');
    const dinersRegex = /^(300|301|302|303|36|38)\d{12,13}$/;
    const mastercardRegex = /^5[1-5]\d{14}$/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
    if (!dinersRegex.test(kartica) && !mastercardRegex.test(kartica) && !visaRegex.test(kartica)) {
      this.validacijaKreditnaKartica = 'Neispravna kreditna kartica. Prihvatamo Diners, MasterCard i Visa kartice.';
    } else {
      this.validacijaKreditnaKartica = '';
    }
  }
  onSubmit() {
    this.greska = '';
    this.poruka = '';
    this.validateKorisnickoIme();
    this.validateLozinka();
    this.validateKreditnaKartica();
    if (this.validacijaKorisnickoIme || this.validacijaLozinka || this.validacijaKreditnaKartica) {
      this.greska = 'Molimo ispravite greške u formi';
      return;
    }
    if (!this.korisnickoIme || !this.lozinka || !this.potvrdaLozinke || !this.ime || 
        !this.prezime || !this.adresa || !this.telefon || !this.email || !this.brojKreditneKartice) {
      this.greska = 'Sva polja su obavezna';
      return;
    }
    if (this.lozinka !== this.potvrdaLozinke) {
      this.greska = 'Lozinke se ne poklapaju';
      return;
    }
    if (!this.profilnaSlika) {
      this.greska = 'Profilna slika je obavezna';
      return;
    }
    const formData = new FormData();
    formData.append('username', this.korisnickoIme);
    formData.append('password', this.lozinka);
    formData.append('firstName', this.ime);
    formData.append('lastName', this.prezime);
    formData.append('gender', this.pol);
    formData.append('address', this.adresa);
    formData.append('phone', this.telefon);
    formData.append('email', this.email);
    formData.append('role', this.tipKorisnika);
    formData.append('creditCard', this.brojKreditneKartice);
    if (this.profilnaSlika) {
      formData.append('profileImage', this.profilnaSlika);
    }
    if (this.bezbedonosnoPitanje && this.odgovorNaPitanje) {
      formData.append('securityQuestion', this.bezbedonosnoPitanje);
      formData.append('securityAnswer', this.odgovorNaPitanje);
    }
    this.ucitavanje = true;
    this.authService.registracija(formData).subscribe({
      next: (response) => {
        this.ucitavanje = false;
        this.poruka = 'Registracija uspešna! Molimo sačekajte odobrenje administratora.';
        setTimeout(() => {
          this.router.navigate(['/prijava']);
        }, 3000);
      },
      error: (err) => {
        this.ucitavanje = false;
        this.greska = err.error?.message || 'Greška pri registraciji. Pokušajte ponovo.';
      }
    });
  }
}

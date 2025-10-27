import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  korisnickoIme = '';
  lozinka = '';
  greska = '';
  ucitavanje = false;
  constructor(
    private authServis: AuthService,
    private router: Router
  ) {}
  prijava(): void {
    this.greska = '';
    if (!this.korisnickoIme || !this.lozinka) {
      this.greska = 'Molimo unesite korisničko ime i lozinku';
      return;
    }
    this.ucitavanje = true;
    this.authServis.prijava({
      username: this.korisnickoIme,
      password: this.lozinka
    }).subscribe({
      next: (odgovor) => {
        if (odgovor.success && odgovor.user) {
          switch (odgovor.user.role) {
            case 'turista':
              this.router.navigate(['/turista/profil']);
              break;
            case 'vlasnik':
              this.router.navigate(['/vlasnik/profil']);
              break;
            case 'admin':
              this.router.navigate(['/admin/korisnici']);
              break;
            default:
              this.router.navigate(['/']);
          }
        } else {
          this.greska = odgovor.message || 'Greška pri prijavljivanju';
        }
        this.ucitavanje = false;
      },
      error: (error) => {
        this.greska = error.error?.message || 'Greška pri prijavljivanju. Proverite kredencijale.';
        this.ucitavanje = false;
      }
    });
  }
}

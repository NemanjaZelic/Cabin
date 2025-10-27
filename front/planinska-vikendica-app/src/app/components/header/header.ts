import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Korisnik } from '../../modeli/korisnik.model';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  trenutniKorisnik: Korisnik | null = null;
  constructor(private authServis: AuthService) {}
  ngOnInit(): void {
    this.authServis.trenutniKorisnik$.subscribe(korisnik => {
      this.trenutniKorisnik = korisnik;
    });
  }
  odjava(): void {
    this.authServis.odjava();
  }
}

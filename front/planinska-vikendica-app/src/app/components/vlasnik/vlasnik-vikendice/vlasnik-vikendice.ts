import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VikendicaService } from '../../../servisi/vikendica.service';
import { Vikendica } from '../../../modeli/vikendica.model.js';
@Component({
  selector: 'app-vlasnik-vikendice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vlasnik-vikendice.html',
  styleUrls: ['./vlasnik-vikendice.css']
})
export class VlasnikVikendicComponent implements OnInit {
  vikendice: Vikendica[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  console = console;
  constructor(
    private vikendicaService: VikendicaService,
    private router: Router
  ) {}
  ngOnInit() {
    this.ucitajMojeVikendice();
  }
  ucitajMojeVikendice() {
    this.ucitavanje = true;
    this.greska = '';
    this.vikendicaService.getMojeVikendice().subscribe({
      next: (response) => {
        this.vikendice = response.data || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju vikendica';
        this.ucitavanje = false;
      }
    });
  }
  dodajNovuVikendicu() {
    this.router.navigate(['/vlasnik/vikendica/nova']);
  }
  izmeniVikendicu(id: string) {
    this.router.navigate(['/vlasnik/vikendica/izmena', id]);
  }
  obrisiVikendicu(vikendica: Vikendica) {
    if (!confirm(`Da li ste sigurni da želite da obrišete vikendicu "${vikendica.name}"?`)) {
      return;
    }
    this.vikendicaService.obrisiVikendicu(vikendica._id!).subscribe({
      next: () => {
        this.poruka = 'Vikendica uspešno obrisana';
        this.ucitajMojeVikendice();
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri brisanju vikendice';
      }
    });
  }
  getRatingStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }
  getSlikaUrl(slika: string): string {
    return slika || 'assets/default-cabin.jpg';
  }
}

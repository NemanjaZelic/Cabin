import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VikendicaService } from '../../../servisi/vikendica.service';
import { Vikendica } from '../../../modeli/vikendica.model.js';
@Component({
  selector: 'app-turista-vikendice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turista-vikendice.html',
  styleUrls: ['./turista-vikendice.css']
})
export class TuristaVikendicComponent implements OnInit {
  vikendice: Vikendica[] = [];
  filtriranVikendice: Vikendica[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  pretragaNaziv: string = '';
  pretragaMesto: string = '';
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  trenutnaStranica: number = 1;
  vikendicaPoStranici: number = 9;
  constructor(
    private vikendicaService: VikendicaService,
    private router: Router
  ) {}
  ngOnInit() {
    this.ucitajVikendice();
  }
  ucitajVikendice() {
    this.ucitavanje = true;
    this.greska = '';
    const parametri = {
      name: this.pretragaNaziv,
      place: this.pretragaMesto,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.vikendicaService.getSveVikendice(parametri).subscribe({
      next: (response) => {
        this.vikendice = response.data || [];
        this.filtrirajVikendice();
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju vikendica';
        this.ucitavanje = false;
      }
    });
  }
  filtrirajVikendice() {
    this.filtriranVikendice = this.vikendice.filter(v => {
      const nazivMatches = !this.pretragaNaziv || 
        v.name.toLowerCase().includes(this.pretragaNaziv.toLowerCase());
      const mestoMatches = !this.pretragaMesto || 
        v.place.toLowerCase().includes(this.pretragaMesto.toLowerCase());
      return nazivMatches && mestoMatches;
    });
    this.trenutnaStranica = 1;
  }
  pretrazi() {
    this.filtrirajVikendice();
  }
  sortiraj() {
    this.ucitajVikendice();
  }
  ocistiPretragu() {
    this.pretragaNaziv = '';
    this.pretragaMesto = '';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.ucitajVikendice();
  }
  getPaginiraneVikendice(): Vikendica[] {
    const start = (this.trenutnaStranica - 1) * this.vikendicaPoStranici;
    const end = start + this.vikendicaPoStranici;
    return this.filtriranVikendice.slice(start, end);
  }
  getBrojStranica(): number {
    return Math.ceil(this.filtriranVikendice.length / this.vikendicaPoStranici);
  }
  getStranice(): number[] {
    const brojStranica = this.getBrojStranica();
    return Array.from({ length: brojStranica }, (_, i) => i + 1);
  }
  idiNaStranicu(stranica: number) {
    this.trenutnaStranica = stranica;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getPrvaSlika(vikendica: Vikendica): string {
    if (vikendica.mainImage) {
      return vikendica.mainImage;
    }
    if (vikendica.images && vikendica.images.length > 0) {
      return vikendica.images[0];
    }
    return 'assets/default-cabin.jpg';
  }
  getRatingStars(rating: number): string[] {
    const stars = [];
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
  prikaziDetalje(vikendica: Vikendica) {
    this.router.navigate(['/turista/vikendica', vikendica._id]);
  }
}

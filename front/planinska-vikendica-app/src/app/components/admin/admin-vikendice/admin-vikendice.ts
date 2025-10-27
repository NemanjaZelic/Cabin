import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../servisi/admin.service';
import { Vikendica } from '../../../modeli/vikendica.model.js';
@Component({
  selector: 'app-admin-vikendice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-vikendice.html',
  styleUrls: ['./admin-vikendice.css']
})
export class AdminVikendicComponent implements OnInit {
  vikendice: Vikendica[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  constructor(private adminService: AdminService) {}
  ngOnInit() {
    this.ucitajVikendice();
  }
  ucitajVikendice() {
    this.ucitavanje = true;
    this.greska = '';
    this.adminService.getSveVikendiceAdmin().subscribe({
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
  getAktivneVikendice(): number {
    return this.vikendice.filter(v => v.owner).length;
  }
}

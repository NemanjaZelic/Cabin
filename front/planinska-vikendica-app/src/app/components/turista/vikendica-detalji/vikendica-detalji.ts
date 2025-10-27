import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VikendicaService } from '../../../servisi/vikendica.service';
import { RezervacijaService } from '../../../servisi/rezervacija.service';
import { KomentarService } from '../../../servisi/komentar.service';
import { AuthService } from '../../../services/auth';
import { Vikendica } from '../../../modeli/vikendica.model.js';
import { Komentar } from '../../../modeli/zajednicko.model.js';
@Component({
  selector: 'app-vikendica-detalji',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vikendica-detalji.html',
  styleUrls: ['./vikendica-detalji.css']
})
export class VikendicaDetaljiComponent implements OnInit {
  vikendica: Vikendica | null = null;
  komentari: Komentar[] = [];
  ucitavanje: boolean = true;
  greska: string = '';
  poruka: string = '';
  prikaziRezervaciju: boolean = false;
  datumOd: string = '';
  datumDo: string = '';
  brojOdraslih: number = 2;
  brojDece: number = 0;
  kreditnaKartica: string = '';
  posebniZahtevi: string = '';
  cuvanje: boolean = false;
  trenutnaSlika: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vikendicaService: VikendicaService,
    private rezervacijaService: RezervacijaService,
    private komentarService: KomentarService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ucitajVikendicu(id);
    }
  }
  ucitajVikendicu(id: string) {
    this.ucitavanje = true;
    this.vikendicaService.getVikendicaPoId(id).subscribe({
      next: (response) => {
        this.vikendica = response.data.cabin || response.data;
        this.komentari = response.data.comments || [];
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju vikendice';
        this.ucitavanje = false;
      }
    });
  }
  ucitajKomentare(vikendicaId: string) {
  }
  getSlika(index: number): string {
    if (this.vikendica && this.vikendica.images && this.vikendica.images[index]) {
      return this.vikendica.images[index];
    }
    return 'assets/default-cabin.jpg';
  }
  sledecaSlika() {
    if (this.vikendica && this.vikendica.images) {
      this.trenutnaSlika = (this.trenutnaSlika + 1) % this.vikendica.images.length;
    }
  }
  prethodnaSlika() {
    if (this.vikendica && this.vikendica.images) {
      this.trenutnaSlika = this.trenutnaSlika === 0 
        ? this.vikendica.images.length - 1 
        : this.trenutnaSlika - 1;
    }
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
  rezervisi() {
    this.greska = '';
    this.poruka = '';
    if (!this.datumOd || !this.datumDo || !this.kreditnaKartica) {
      this.greska = 'Molimo popunite sva obavezna polja';
      return;
    }
    const od = new Date(this.datumOd);
    const do_ = new Date(this.datumDo);
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    if (od < danas) {
      this.greska = 'Datum početka ne može biti u prošlosti';
      return;
    }
    if (do_ <= od) {
      this.greska = 'Datum kraja mora biti nakon datuma početka';
      return;
    }
    if (this.brojOdraslih < 1) {
      this.greska = 'Mora biti najmanje 1 odrasla osoba';
      return;
    }
    const zahtev = {
      cabinId: this.vikendica!._id!,
      startDate: new Date(this.datumOd),
      endDate: new Date(this.datumDo),
      adults: this.brojOdraslih,
      children: this.brojDece,
      creditCard: this.kreditnaKartica,
      specialRequests: this.posebniZahtevi
    };
    this.cuvanje = true;
    this.rezervacijaService.kreirajRezervaciju(zahtev).subscribe({
      next: (response) => {
        this.cuvanje = false;
        this.poruka = 'Rezervacija uspešno kreirana! Čeka se potvrda vlasnika.';
        this.prikaziRezervaciju = false;
        this.resetujFormu();
        setTimeout(() => {
          this.router.navigate(['/turista/rezervacije']);
        }, 2000);
      },
      error: (err) => {
        this.cuvanje = false;
        this.greska = err.error?.message || 'Greška pri kreiranju rezervacije';
      }
    });
  }
  resetujFormu() {
    this.datumOd = '';
    this.datumDo = '';
    this.brojOdraslih = 2;
    this.brojDece = 0;
    this.kreditnaKartica = '';
    this.posebniZahtevi = '';
  }
  nazad() {
    this.router.navigate(['/turista/vikendice']);
  }
}

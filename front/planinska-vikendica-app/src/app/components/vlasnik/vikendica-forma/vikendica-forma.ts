import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VikendicaService } from '../../../servisi/vikendica.service';
import { Vikendica } from '../../../modeli/vikendica.model.js';
@Component({
  selector: 'app-vikendica-forma',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vikendica-forma.html',
  styleUrls: ['./vikendica-forma.css']
})
export class VikendicaFormaComponent implements OnInit {
  vikendicaId: string | null = null;
  jeIzmena: boolean = false;
  naziv: string = '';
  mesto: string = '';
  cenaLeto: number = 0;
  cenaZima: number = 0;
  telefon: string = '';
  latitude: number = 0;
  longitude: number = 0;
  wifi: boolean = false;
  parking: boolean = false;
  klima: boolean = false;
  kuhinja: boolean = false;
  tv: boolean = false;
  bazen: boolean = false;
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  postojeceSlike: string[] = [];
  poruka: string = '';
  greska: string = '';
  ucitavanje: boolean = false;
  constructor(
    private vikendicaService: VikendicaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.vikendicaId = this.route.snapshot.paramMap.get('id');
    this.jeIzmena = !!this.vikendicaId;
    if (this.jeIzmena && this.vikendicaId) {
      this.ucitajVikendicu(this.vikendicaId);
    }
  }
  ucitajVikendicu(id: string) {
    this.ucitavanje = true;
    this.vikendicaService.getVikendicaPoId(id).subscribe({
      next: (response) => {
        const vikendica = response.data;
        this.popuniFormu(vikendica);
        this.ucitavanje = false;
      },
      error: (err) => {
        this.greska = 'Greška pri učitavanju vikendice';
        this.ucitavanje = false;
      }
    });
  }
  popuniFormu(vikendica: any) {
    this.naziv = vikendica.name;
    this.mesto = vikendica.place;
    this.cenaLeto = vikendica.pricing?.summer || 0;
    this.cenaZima = vikendica.pricing?.winter || 0;
    this.telefon = vikendica.phone || '';
    this.latitude = vikendica.coordinates?.latitude || 0;
    this.longitude = vikendica.coordinates?.longitude || 0;
    const servisiString = vikendica.services || '';
    const servisi = servisiString.split(',').filter((s: string) => s.trim());
    this.wifi = servisi.includes('wifi');
    this.parking = servisi.includes('parking');
    this.klima = servisi.includes('klima');
    this.kuhinja = servisi.includes('kuhinja');
    this.tv = servisi.includes('tv');
    this.bazen = servisi.includes('bazen');
    this.postojeceSlike = vikendica.images || [];
  }
  onFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        this.greska = `Slika ${file.name} je veća od 2MB`;
        continue;
      }
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  ukloniNovuSliku(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }
  ukloniPostojecuSliku(index: number) {
    this.postojeceSlike.splice(index, 1);
  }
  sacuvaj() {
    this.poruka = '';
    this.greska = '';
    if (!this.naziv || !this.mesto || !this.cenaLeto || !this.cenaZima || !this.telefon) {
      this.greska = 'Naziv, mesto, cene (leto/zima) i telefon su obavezni';
      return;
    }
    if (this.cenaLeto < 0 || this.cenaZima < 0) {
      this.greska = 'Cene moraju biti pozitivne';
      return;
    }
    if (!this.jeIzmena && this.selectedFiles.length === 0) {
      this.greska = 'Morate dodati najmanje jednu sliku';
      return;
    }
    const formData = new FormData();
    formData.append('name', this.naziv);
    formData.append('place', this.mesto);
    formData.append('pricingSummer', this.cenaLeto.toString());
    formData.append('pricingWinter', this.cenaZima.toString());
    formData.append('phone', this.telefon);
    formData.append('latitude', this.latitude.toString());
    formData.append('longitude', this.longitude.toString());
    const servisi: string[] = [];
    if (this.wifi) servisi.push('wifi');
    if (this.parking) servisi.push('parking');
    if (this.klima) servisi.push('klima');
    if (this.kuhinja) servisi.push('kuhinja');
    if (this.tv) servisi.push('tv');
    if (this.bazen) servisi.push('bazen');
    formData.append('services', servisi.join(','));
    
    this.selectedFiles.forEach(file => {
      formData.append('cabinImages', file);
    });
    
    if (this.jeIzmena) {
      this.postojeceSlike.forEach(slika => {
        formData.append('existingImages[]', slika);
      });
    }
    this.ucitavanje = true;
    const request = this.jeIzmena
      ? this.vikendicaService.azurirajVikendicu(this.vikendicaId!, formData)
      : this.vikendicaService.kreirajVikendicu(formData);
    request.subscribe({
      next: (response) => {
        this.poruka = this.jeIzmena ? 'Vikendica uspešno ažurirana' : 'Vikendica uspešno kreirana';
        this.ucitavanje = false;
        setTimeout(() => {
          this.router.navigate(['/vlasnik/vikendice']);
        }, 1500);
      },
      error: (err) => {
        this.greska = err.error?.message || 'Greška pri čuvanju vikendice';
        this.ucitavanje = false;
      }
    });
  }
  otkazi() {
    this.router.navigate(['/vlasnik/vikendice']);
  }
  getSlikaUrl(slika: string): string {
    return slika || 'assets/default-cabin.jpg';
  }
}

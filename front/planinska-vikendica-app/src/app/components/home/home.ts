import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StatistikaService } from '../../servisi/statistika.service';
import { VikendicaService } from '../../servisi/vikendica.service';
import { OpsaStatistika } from '../../modeli/zajednicko.model';
import { Vikendica, ParametriPretrage } from '../../modeli/vikendica.model';
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  statistika: OpsaStatistika | null = null;
  vikendice: Vikendica[] = [];
  ucitavanje = false;
  naziv = '';
  mesto = '';
  sortPolje = 'createdAt';
  sortSmer: 'asc' | 'desc' = 'desc';
  constructor(
    private statistikaServis: StatistikaService,
    private vikendicaServis: VikendicaService
  ) {}
  ngOnInit(): void {
    this.ucitajStatistiku();
    this.ucitajVikendice();
  }
  ucitajStatistiku(): void {
    this.statistikaServis.getOpstuStatistiku().subscribe({
      next: (odgovor) => {
        if (odgovor.success) {
          this.statistika = odgovor.data;
        }
      },
      error: (greska) => {
      }
    });
  }
  ucitajVikendice(): void {
    this.ucitavanje = true;
    const parametri: ParametriPretrage = {
      sortBy: this.sortPolje,
      sortOrder: this.sortSmer
    };
    if (this.naziv.trim()) {
      parametri.name = this.naziv.trim();
    }
    if (this.mesto.trim()) {
      parametri.place = this.mesto.trim();
    }
    this.vikendicaServis.getSveVikendice(parametri).subscribe({
      next: (odgovor) => {
        if (odgovor.success) {
          this.vikendice = odgovor.data;
        }
        this.ucitavanje = false;
      },
      error: (greska) => {
        this.ucitavanje = false;
      }
    });
  }
  pretrazi(): void {
    this.ucitajVikendice();
  }
  resetujPretragu(): void {
    this.naziv = '';
    this.mesto = '';
    this.sortPolje = 'createdAt';
    this.sortSmer = 'desc';
    this.ucitajVikendice();
  }
  sortiraj(polje: string): void {
    if (this.sortPolje === polje) {
      this.sortSmer = this.sortSmer === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortPolje = polje;
      this.sortSmer = 'asc';
    }
    this.ucitajVikendice();
  }
  getIkonicaSortiranja(polje: string): string {
    if (this.sortPolje !== polje) return '';
    return this.sortSmer === 'asc' ? '↑' : '↓';
  }
  getZvezdice(ocena: number): string {
    const punihZvezdica = Math.floor(ocena);
    const poluZvezdica = ocena % 1 >= 0.5 ? 1 : 0;
    const praznihZvezdica = 5 - punihZvezdica - poluZvezdica;
    return '*'.repeat(punihZvezdica) + 
           (poluZvezdica ? '*' : '') + 
           '*'.repeat(praznihZvezdica);
  }
}

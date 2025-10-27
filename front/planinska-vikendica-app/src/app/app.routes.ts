import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { Registracija } from './components/registracija/registracija';
import { TuristaProfilComponent } from './components/turista/turista-profil/turista-profil';
import { TuristaVikendicComponent } from './components/turista/turista-vikendice/turista-vikendice';
import { VikendicaDetaljiComponent } from './components/turista/vikendica-detalji/vikendica-detalji';
import { TuristaRezervacijeComponent } from './components/turista/turista-rezervacije/turista-rezervacije';
import { VlasnikProfilComponent } from './components/vlasnik/vlasnik-profil/vlasnik-profil';
import { VlasnikVikendicComponent } from './components/vlasnik/vlasnik-vikendice/vlasnik-vikendice';
import { VikendicaFormaComponent } from './components/vlasnik/vikendica-forma/vikendica-forma';
import { VlasnikRezervacijeComponent } from './components/vlasnik/vlasnik-rezervacije/vlasnik-rezervacije';
import { AdminKorisniciComponent } from './components/admin/admin-korisnici/admin-korisnici';
import { AdminZahteviComponent } from './components/admin/admin-zahtevi/admin-zahtevi';
import { AdminVikendicComponent } from './components/admin/admin-vikendice/admin-vikendice';
import { autentifikacijaGuard, ulogaGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'prijava',
    component: LoginComponent
  },
  {
    path: 'registracija',
    component: Registracija
  },
  {
    path: 'turista/profil',
    component: TuristaProfilComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'turista' }
  },
  {
    path: 'turista/vikendice',
    component: TuristaVikendicComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'turista' }
  },
  {
    path: 'turista/vikendica/:id',
    component: VikendicaDetaljiComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'turista' }
  },
  {
    path: 'turista/rezervacije',
    component: TuristaRezervacijeComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'turista' }
  },
  {
    path: 'vlasnik/profil',
    component: VlasnikProfilComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'vlasnik' }
  },
  {
    path: 'vlasnik/vikendice',
    component: VlasnikVikendicComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'vlasnik' }
  },
  {
    path: 'vlasnik/vikendica/nova',
    component: VikendicaFormaComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'vlasnik' }
  },
  {
    path: 'vlasnik/vikendica/izmena/:id',
    component: VikendicaFormaComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'vlasnik' }
  },
  {
    path: 'vlasnik/rezervacije',
    component: VlasnikRezervacijeComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'vlasnik' }
  },
  {
    path: 'admin/korisnici',
    component: AdminKorisniciComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/zahtevi',
    component: AdminZahteviComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'admin' }
  },
  {
    path: 'admin/vikendice',
    component: AdminVikendicComponent,
    canActivate: [autentifikacijaGuard, ulogaGuard],
    data: { role: 'admin' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

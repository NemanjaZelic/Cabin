import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
export const autentifikacijaGuard: CanActivateFn = (ruta, stanje) => {
  const authServis = inject(AuthService);
  const router = inject(Router);
  if (authServis.jeAutentifikovan()) {
    return true;
  }
  router.navigate(['/prijava']);
  return false;
};
export const ulogaGuard = (dozvoljeneUloge: string[]): CanActivateFn => {
  return (ruta, stanje) => {
    const authServis = inject(AuthService);
    const router = inject(Router);
    if (!authServis.jeAutentifikovan()) {
      router.navigate(['/prijava']);
      return false;
    }
    const korisnickaUloga = authServis.getUlogaKorisnika();
    if (dozvoljeneUloge.includes(korisnickaUloga)) {
      return true;
    }
    router.navigate(['/']);
    return false;
  };
};

export interface Korisnik {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'Ž';
  address: string;
  phone: string;
  email: string;
  profileImage?: string;
  creditCard?: string;
  role: 'turista' | 'vlasnik' | 'admin';
  status: 'pending' | 'active' | 'rejected' | 'deactivated';
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ZahtevZaPrijavu {
  username: string;
  password: string;
}
export interface ZahtevZaRegistraciju {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'Ž';
  address: string;
  phone: string;
  email: string;
  creditCard: string;
  role?: 'turista' | 'vlasnik';
}
export interface OdgovorAutentifikacije {
  success: boolean;
  token?: string;
  user?: Korisnik;
  message?: string;
}

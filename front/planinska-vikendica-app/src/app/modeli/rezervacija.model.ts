export interface Rezervacija {
  _id?: string;
  cabin: string | any;
  tourist: string | any;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  totalPrice: number;
  creditCard: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ZahtevZaRezervaciju {
  cabinId: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  creditCard: string;
  specialRequests?: string;
}

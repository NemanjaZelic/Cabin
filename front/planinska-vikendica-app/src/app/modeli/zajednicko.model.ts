export interface Komentar {
  _id?: string;
  cabin: string;
  tourist: string | any;
  reservation: string;
  text: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OpsaStatistika {
  totalCabins: number;
  totalOwners: number;
  totalTourists: number;
  reservations24h: number;
  reservations7d: number;
  reservations30d: number;
}

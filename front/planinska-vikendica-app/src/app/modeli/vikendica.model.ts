export interface Vikendica {
  _id?: string;
  name: string;
  place: string;
  pricing: {
    summer: number;
    winter: number;
  };
  phone: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  services: string; // Backend čuva kao string "wifi,parking,klima"
  owner: string | any;
  mainImage?: string;
  images: string[];
  averageRating: number;
  lastThreeRatings?: number[];
  isBlocked?: boolean;
  blockedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ParametriPretrage {
  name?: string;
  place?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

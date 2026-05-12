import type { LucideIcon } from 'lucide-react';

export type UserRole = 'client' | 'professional';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export interface Review {
  id: string;
  professionalId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  category: string;
  city: string;
  neighborhood: string;
  description: string;
  avatarUrl: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  whatsapp: string;
  instagram: string;
  schedule: string[];
  startingPrice: number;
  homeCare: boolean;
  onlineCare: boolean;
  featured: boolean;
  distanceKm: number;
  clicks: number;
  leads: number;
  students: number;
  followers: number;
  likes: number;
}

export interface Lead {
  id: string;
  professionalId: string;
  userId: string;
  source: 'whatsapp' | 'profile' | 'schedule';
  createdAt: string;
}

export interface Filters {
  category: string;
  city: string;
  neighborhood: string;
  maxPrice: number;
  minRating: number;
  homeCare: boolean;
  onlineCare: boolean;
}

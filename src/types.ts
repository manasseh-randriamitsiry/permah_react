export interface User {
  id: number;
  name: string;
  email: string;
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  image_url: string;
  available_places: number;
  price: number;
  creator?: User;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: User;
  attendees?: User[];
  participants?: User[];
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export type CreateEventRequest = Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 'user' | 'attendees' | 'participants'>; 
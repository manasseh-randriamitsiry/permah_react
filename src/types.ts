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

export interface EventStatistics {
    total_places: number;
    attendees_count: number;
    available_places: number;
    occupancy_rate: number;
    is_full: boolean;
}

export interface EventParticipantsResponse {
    event_id: number;
    event_title: string;
    total_participants: number;
    participants: User[];
}

export interface EventSearchParams {
    q?: string;
    start_date?: string;
    end_date?: string;
    location?: string;
    min_price?: number;
    max_price?: number;
    has_available_places?: boolean;
} 
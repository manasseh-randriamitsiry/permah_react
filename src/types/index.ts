export interface User {
  id: number;
  name: string;
  email: string;
}

export interface EventData {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  available_places: number;
  price: number;
  user_id: number;
  organizer_id?: number;
  created_at: string;
  updated_at: string;
  user: User;
  attendees?: User[];
  participants?: User[];  // Some APIs might use participants instead of attendees
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  available_places: number;
  price: number;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}
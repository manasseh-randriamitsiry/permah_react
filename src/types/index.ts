export interface User {
  id: number;
  email: string;
  name: string;
  type?: string;
  created_at?: string;
  events?: Event[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  number_place: number;
  price: number;
  organizer_name: string;
  user_id: number;
  image_url: string;
  creation_date: string;
}

export interface EventWithUser extends Omit<Event, 'user_id'> {
  created_at: string;
  User: {
    username: string;
    email: string;
  }
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
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
  number_place: number;
  price: number;
  organizer_name: string;
  image_url: string;
}
import axios from 'axios';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8000/api';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    availablePlaces: number;
    price: number;
    imageUrl: string;
    creator: {
        id: number;
        name: string;
    };
}

export class EventService {
    static async listEvents() {
        const response = await axios.get<Event[]>(`${API_URL}/events`, {
            headers: AuthService.getAuthHeader()
        });
        return response.data;
    }

    static async getEvent(id: number) {
        return axios.get(`${API_URL}/events/${id}`, {
            headers: AuthService.getAuthHeader()
        });
    }

    static async createEvent(eventData: Omit<Event, 'id' | 'creator'>) {
        const response = await axios.post<Event>(`${API_URL}/events`, eventData, {
            headers: AuthService.getAuthHeader()
        });
        return response.data;
    }

    static async updateEvent(id: number, eventData: any) {
        return axios.put(`${API_URL}/events/${id}`, eventData, {
            headers: AuthService.getAuthHeader()
        });
    }

    static async deleteEvent(id: number) {
        return axios.delete(`${API_URL}/events/${id}`, {
            headers: AuthService.getAuthHeader()
        });
    }

    static async joinEvent(id: number) {
        return axios.post(`${API_URL}/events/${id}/join`, {}, {
            headers: AuthService.getAuthHeader()
        });
    }

    static async leaveEvent(id: number) {
        return axios.delete(`${API_URL}/events/${id}/leave`, {
            headers: AuthService.getAuthHeader()
        });
    }
}

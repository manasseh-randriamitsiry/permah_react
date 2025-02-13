import { SecurityService } from './auth.service';
import type { EventData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class EventService {
    static async listEvents() {
        try {
            console.log('Fetching events from:', `${API_URL}/events`);
            const response = await fetch(`${API_URL}/events`, {
                method: 'GET',
                headers: {
                    ...SecurityService.getAuthHeaders(),
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch events');
                } else {
                    const text = await response.text();
                    console.error('Non-JSON response:', text);
                    throw new Error('Invalid server response');
                }
            }

            const data = await response.json();
            console.log('Events data:', data);
            return data;
        } catch (error) {
            console.error('Error in listEvents:', error);
            throw error;
        }
    }

    static async getEvent(id: number) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'GET',
                headers: {
                    ...SecurityService.getAuthHeaders(),
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch event');
                } else {
                    throw new Error('Invalid server response');
                }
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    }

    static async createEvent(eventData: Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>) {
        const response = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: SecurityService.getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create event');
        }

        return await response.json();
    }

    static async updateEvent(id: number, eventData: any) {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'PUT',
            headers: SecurityService.getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update event');
        }

        return await response.json();
    }

    static async deleteEvent(id: number) {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: SecurityService.getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        return response;
    }

    static async joinEvent(id: number) {
        try {
            const response = await fetch(`${API_URL}/events/${id}/join`, {
                method: 'POST',
                headers: {
                    ...SecurityService.getAuthHeaders(),
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to join event');
                } else {
                    throw new Error('Invalid server response');
                }
            }

            return await response.json();
        } catch (error) {
            console.error('Error joining event:', error);
            throw error;
        }
    }

    static async leaveEvent(id: number) {
        const response = await fetch(`${API_URL}/events/${id}/leave`, {
            method: 'DELETE',
            headers: SecurityService.getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to leave event');
        }

        return await response.json();
    }

    static async listUserEvents() {
        const response = await fetch(`${API_URL}/events/my`, {
            method: 'GET',
            headers: SecurityService.getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user events');
        }

        return await response.json();
    }
}

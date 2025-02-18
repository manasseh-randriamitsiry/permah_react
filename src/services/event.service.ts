import { SecurityService } from './auth.service';
import type { EventData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class EventService {
    static async listEvents() {
        try {
            console.log('Fetching events from:', `${API_URL}/events`);
            const response = await fetch(`${API_URL}/events`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
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
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            console.error('Error in listEvents:', error);
            throw error;
        }
    }

    static async getEvent(id: number) {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to fetch event');
                } else {
                    throw new Error('Invalid server response');
                }
            }

            return await response.json();
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            console.error('Error fetching event:', error);
            throw error;
        }
    }

    static async createEvent(eventData: Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>) {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to create events');
            }

            console.log('Creating event with data:', JSON.stringify(eventData, null, 2));
            
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(eventData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                const contentType = response.headers.get('content-type');
                console.log('Error response content type:', contentType);
                
                try {
                    const errorText = await response.text();
                    console.log('Raw error response:', errorText);
                    
                    if (contentType?.includes('application/json')) {
                        const error = JSON.parse(errorText);
                        console.error('Server error response:', error);
                        throw new Error(error.message || 'Failed to create event');
                    } else {
                        console.error('Non-JSON error response:', errorText);
                        throw new Error('Invalid server response');
                    }
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                    throw new Error('Failed to parse server response');
                }
            }

            const data = await response.json();
            console.log('Event created successfully:', data);
            return data;
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            console.error('Error in createEvent:', error);
            throw error;
        }
    }

    static async updateEvent(id: number, eventData: Partial<Omit<EventData, 'id' | 'creator' | 'created_at' | 'updated_at' | 'user' | 'attendees' | 'participants'>>) {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to update events');
            }

            console.log('Updating event with data:', eventData);
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include',
                body: JSON.stringify(eventData)
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const error = await response.json();
                    console.error('Server error response:', error);
                    throw new Error(error.message || 'Failed to update event');
                } else {
                    const text = await response.text();
                    console.error('Non-JSON error response:', text);
                    throw new Error('Invalid server response');
                }
            }

            const data = await response.json();
            console.log('Event updated successfully:', data);
            return data;
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            console.error('Error in updateEvent:', error);
            throw error;
        }
    }

    static async deleteEvent(id: number) {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to delete events');
            }

            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'DELETE',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                throw new Error('Failed to delete event');
            }

            return response;
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            throw error;
        }
    }

    static async joinEvent(id: number) {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to join events');
            }

            const response = await fetch(`${API_URL}/events/${id}/join`, {
                method: 'POST',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                if (response.headers.get('content-type')?.includes('application/json')) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to join event');
                } else {
                    throw new Error('Invalid server response');
                }
            }

            return await response.json();
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            console.error('Error joining event:', error);
            throw error;
        }
    }

    static async leaveEvent(id: number) {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to leave events');
            }

            const response = await fetch(`${API_URL}/events/${id}/leave`, {
                method: 'DELETE',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                const error = await response.json();
                throw new Error(error.message || 'Failed to leave event');
            }

            return await response.json();
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            throw error;
        }
    }

    static async listUserEvents() {
        try {
            if (!SecurityService.isAuthenticated()) {
                throw new Error('Please log in to view your events');
            }

            const response = await fetch(`${API_URL}/events/my`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch user events');
            }

            return await response.json();
        } catch (error: any) {
            if (error.message === 'No authentication token found') {
                SecurityService.clearAuth();
                throw new Error('Please log in to continue');
            }
            throw error;
        }
    }

    static async getUpcomingEvents() {
        try {
            const response = await fetch(`${API_URL}/events/my-created?type=upcoming`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch upcoming events');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getUpcomingEvents:', error);
            throw error;
        }
    }

    static async getPastEvents() {
        try {
            const response = await fetch(`${API_URL}/events/my-created?type=past`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch past events');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getPastEvents:', error);
            throw error;
        }
    }

    static async searchEvents(params: {
        q?: string;
        start_date?: string;
        end_date?: string;
        location?: string;
        min_price?: number;
        max_price?: number;
        has_available_places?: boolean;
    }) {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_URL}/events/search?${queryParams}`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to search events');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in searchEvents:', error);
            throw error;
        }
    }

    static async getEventStatistics(id: number) {
        try {
            const response = await fetch(`${API_URL}/events/${id}/statistics`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch event statistics');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getEventStatistics:', error);
            throw error;
        }
    }

    static async getEventParticipants(id: number) {
        try {
            const response = await fetch(`${API_URL}/events/${id}/participants`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch event participants');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getEventParticipants:', error);
            throw error;
        }
    }

    static async getMyCreatedEvents() {
        try {
            const response = await fetch(`${API_URL}/events/my-created`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch created events');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getMyCreatedEvents:', error);
            throw error;
        }
    }

    static async getMyAttendedEvents() {
        try {
            const response = await fetch(`${API_URL}/events/my-attended`, {
                method: 'GET',
                headers: SecurityService.getAuthHeaders(),
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    SecurityService.clearAuth();
                    throw new Error('Please log in to continue');
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch attended events');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error in getMyAttendedEvents:', error);
            throw error;
        }
    }
}

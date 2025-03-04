  totalParticipants: created.reduce((sum: number, event: EventWithStats) => sum + (event.attendees_count || 0), 0),
  totalIncome: created.reduce((sum: number, event: EventWithStats) => sum + (event.price * (event.attendees_count || 0)), 0),
  totalAvailablePlaces: created.reduce((sum: number, event: EventWithStats) => sum + event.available_places, 0),
  averageOccupancyRate: created.length > 0 
    ? (created.reduce((sum: number, event: EventWithStats) => sum + (event.attendees_count || 0), 0) / 
       created.reduce((sum: number, event: EventWithStats) => sum + event.available_places, 0)) * 100
    : 0 
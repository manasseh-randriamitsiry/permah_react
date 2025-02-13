export interface SortConfig {
  key: 'startDate' | 'endDate' | 'totalPlaces' | 'joinedCount' | 'status' | 'title' | 'earnings';
  direction: 'asc' | 'desc';
}

export interface DashboardStats {
  upcoming: number;
  incoming: number;
  past: number;
  totalParticipants: number;
  totalIncome: number;
} 
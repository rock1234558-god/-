export interface User {
  id?: number;
  staffId: string;
  name: string;
  role: 'admin' | 'staff';
  password?: string;
}

export interface MealRecord {
  id?: number;
  staffId: string;
  name: string;
  date: string;
  mealType: string;
  amount: number;
}

export interface AuthResponse {
  user: User;
  token?: string; // We'll use simple local storage for now, but in a real app this would be a JWT
}

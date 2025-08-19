export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  image?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}
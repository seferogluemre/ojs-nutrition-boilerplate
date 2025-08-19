import { User } from '../types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@example.com',
    role: 'admin',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    email: 'ayse@example.com',
    role: 'user',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet@example.com',
    role: 'moderator',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: false,
    createdAt: '2024-01-05',
    lastLogin: '2024-01-18'
  },
  {
    id: '4',
    firstName: 'Fatma',
    lastName: 'Özkan',
    email: 'fatma@example.com',
    role: 'user',
    isActive: true,
    createdAt: '2024-01-12',
    lastLogin: '2024-01-20'
  },
  {
    id: '5',
    firstName: 'Ali',
    lastName: 'Çelik',
    email: 'ali@example.com',
    role: 'user',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: true,
    createdAt: '2024-01-08',
    lastLogin: '2024-01-19'
  },
  {
    id: '6',
    firstName: 'Zeynep',
    lastName: 'Arslan',
    email: 'zeynep@example.com',
    role: 'moderator',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    isActive: false,
    createdAt: '2024-01-03',
    lastLogin: '2024-01-17'
  }
];
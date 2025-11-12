export interface Algorithm {
  id: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  isPaid: boolean;
  price?: number; // Добавляем поле цены
  code?: string;
  language: string;
  compiler: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'author' | 'consumer' | 'moderator';
}
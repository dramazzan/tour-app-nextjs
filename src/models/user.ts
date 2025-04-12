export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string; // в формате ISO, можно преобразовать в Date при необходимости
    updated_at: string; // в формате ISO
  }
  
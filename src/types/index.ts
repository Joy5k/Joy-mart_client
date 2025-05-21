export interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// types/index.ts
export type Role = 'superAdmin' | 'admin' | 'seller' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  updatedAt: string;

}
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who created the product
}

export type ProductCategory = 'electronics' | 'clothing' | 'home' | 'books' | 'other';
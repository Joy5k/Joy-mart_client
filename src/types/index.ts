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
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

export interface IProduct {
  _id:string
  title: string; 
  shortTitle?: string;
  description: string; 
  shortDescription?: string;

  // Pricing
  price: number; 
  originalPrice?: number;
  discountPercentage?: number;
  costPrice?: number;

  // Inventory
  stock: number;
  lowStockThreshold?: number; 
  weight?: number; 
  dimensions?: {
    // Product size (L×W×H)
    length: number;
    width: number;
    height: number;
  };

  // Categorization
  category?: TCategory  ; 
  subCategory?: string; 
  tags?: string[]; 

  // Media
  images: string[]; 
  thumbnail?: string; 
  videoUrl?: string;

  // Variants
  attributes?: {
    // Key-value pairs (e.g., {color: "Red", size: "XL"})
    [key: string]: string;
  };

  // Marketing
  featured?: boolean;
  rating?: {
    average: number;
    count: number;
  };

  shipping?: {
    free: boolean;
    processingTime: string;
  };

  isDeleted?: boolean;
  isActive?: boolean;
}


export type TCategory = {
  _id: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  isSubCategory: boolean;
  createdAt: string; 
  updatedAt: string;
}


export interface IProfile {
  firstName?: string;
  lastName?: string;
  image?: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  isDeleted?: boolean;
}



export type TFormData = {
  categoryName: string;
  description: string;
  isActive:boolean
};


export interface Product {
  _id: string;
  title: string;
  price: number;
  images: string[];
  stock: number;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  productId: Product;
  bookingQuantity: number;
  userId: string;
  orderStatus: string;
  createdAt: string;
  totalPrice: number;
}


export interface IOrder  {
    orderId:string,
    orderStatus: string;
    paymentDetails: { currency: string },
    paymentMethod: string,
    paymentStatus: string,
    productIds: string[],
    totalAmount: number,
    createdAt: string,
    contactInfo: {
      phone: string,
      email: string
    },
    userId: {
      _id: string,
      email: string
    }
  };

  export interface TUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "superAdmin" | "admin" | "user" | "seller";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export  interface ReportedProduct {
  _id: string;
  productId: {
    _id: string;
    title: string;
    price: number;
    images: string[];
  };
  reason: string;
  description?: string;
  reportImages?: string[];
  reportedBy: {
    _id: string;
    name?: string;
    email: string;
  };
  status: 'pending' | 'resolved' | 'rejected';
  adminReply?: {
    message?: string;
    repliedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}


export interface IMessage{
  title:string,
  body:string
}
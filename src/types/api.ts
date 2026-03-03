export interface ApiProduct {
   id: string;
   title: string;
   description: string;
   price: number | null;
   image: string;
   category: string;
}

export type PaymentMethod = 'card' | 'cash';

export interface ApiOrderRequest {
   items: string[];
   total: number;
   payment: PaymentMethod;
   address: string;
   email: string;
   phone: string;
}

export interface ApiOrderResponse {
   id: string;
   total: number;
}
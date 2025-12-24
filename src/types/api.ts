export interface ApiProduct {
   id: string;
   title: string;
   description: string;
   price: number;
   image: string;
}

export type PaymentMethod = 'card' | 'cash';

export interface ApiOrderRequest {
   items: string[];
   payment: PaymentMethod;
   address: string;
   email: string;
   phone: string;
}

export interface ApiOrderResponse {
   id: string;
   total: number;
}
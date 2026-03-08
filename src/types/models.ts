import type { ApiProduct, PaymentMethod } from './api';

export type OrderFormData = {
   payment: PaymentMethod | null;
   address: string;
   email: string;
   phone: string;
};

export type OrderValidationErrors = Partial<Record<keyof OrderFormData, string>>;

export interface IProductModel {
   loadProducts(): Promise<void>;
   getProducts(): readonly ApiProduct[];
   getProductById(id: string): ApiProduct | undefined;
   setSelectedProduct(productId: string): void;
   getSelectedProduct(): ApiProduct | undefined;
   clearSelectedProduct(): void;
}

export interface ICartModel {
   addProduct(product: ApiProduct): void;
   removeProduct(productId: string): void;
   hasProduct(productId: string): boolean;
   getItems(): readonly ApiProduct[];
   getTotalPrice(): number;
   getCount(): number;
   clear(): void;
}

export interface IOrderModel {
   setField<K extends keyof OrderFormData>(field: K, value: OrderFormData[K]): void;
   getData(): OrderFormData;
   validate(): OrderValidationErrors;
   clear(): void;
}
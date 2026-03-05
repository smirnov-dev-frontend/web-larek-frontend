import { ApiProduct, ApiOrderRequest, ApiOrderResponse } from './api';

export interface IProductModel {
   loadProducts(): Promise<void>;
   getProducts(): readonly ApiProduct[];
   getProductById(id: string): ApiProduct | undefined;
}

export interface ICartModel {
   addProduct(productId: string): void;
   removeProduct(productId: string): void;
   hasProduct(productId: string): boolean;
   getItems(): readonly string[];
   clear(): void;
}

export interface IOrderModel {
   createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>;
}
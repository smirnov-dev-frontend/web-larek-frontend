import { ApiProduct, ApiOrderRequest, ApiOrderResponse } from './api';

export interface IProductModel {
   loadProducts(): Promise<void>;
   getProducts(): ApiProduct[];
   getProductById(id: string): ApiProduct | undefined;
}

export interface ICartModel {
   addProduct(product: ApiProduct): void;
   removeProduct(productId: string): void;
   getItems(): ApiProduct[];
   getTotalPrice(): number;
   clear(): void;
}

export interface IOrderModel {
   createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>;
}
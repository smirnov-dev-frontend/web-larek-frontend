import { ApiProduct, ApiOrderRequest, ApiOrderResponse } from './api';

export interface IApiClient {
   getProducts(): Promise<ApiProduct[]>;
   createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>;
}
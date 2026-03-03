import type { IApiClient, ApiProduct, ApiOrderRequest, ApiOrderResponse } from '../types';
import { Api } from '../components/base/Api';

type ProductsResponse = {
   total: number;
   items: ApiProduct[];
};

export class LarekApiClient implements IApiClient {
   constructor(private readonly api: Api) { }

   async getProducts(): Promise<ApiProduct[]> {
      const res = await this.api.get<ProductsResponse>('/product');
      return res.items;
   }

   async createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse> {
      return this.api.post<ApiOrderResponse>('/order', data);
   }
}
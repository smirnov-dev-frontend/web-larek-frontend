import type { IApiClient, IOrderModel, ApiOrderRequest, ApiOrderResponse } from '../types';

export class OrderModel implements IOrderModel {
   constructor(private readonly apiClient: IApiClient) { }

   createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse> {
      return this.apiClient.createOrder(data);
   }
}
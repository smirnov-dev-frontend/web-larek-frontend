import type { IApiClient, IProductModel, ApiProduct } from '../types';

export class ProductModel implements IProductModel {
   private products: ApiProduct[] = [];

   constructor(private readonly apiClient: IApiClient) { }

   async loadProducts(): Promise<void> {
      this.products = await this.apiClient.getProducts();
   }

   getProducts(): ApiProduct[] {
      return this.products;
   }

   getProductById(id: string): ApiProduct | undefined {
      return this.products.find(p => p.id === id);
   }
}
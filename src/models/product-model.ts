import type { IApiClient, IProductModel, ApiProduct } from '../types';

export class ProductModel implements IProductModel {
   private products: ApiProduct[] = [];
   private selectedProductId: string | null = null;

   constructor(private readonly apiClient: IApiClient) { }

   async loadProducts(): Promise<void> {
      try {
         this.products = await this.apiClient.getProducts();
      } catch (error) {
         throw new Error(
            error instanceof Error ? error.message : 'Не удалось загрузить каталог товаров'
         );
      }
   }

   getProducts(): readonly ApiProduct[] {
      return this.products;
   }

   getProductById(id: string): ApiProduct | undefined {
      return this.products.find((product) => product.id === id);
   }

   setSelectedProduct(productId: string): void {
      this.selectedProductId = productId;
   }

   getSelectedProduct(): ApiProduct | undefined {
      if (!this.selectedProductId) return undefined;
      return this.getProductById(this.selectedProductId);
   }

   clearSelectedProduct(): void {
      this.selectedProductId = null;
   }
}
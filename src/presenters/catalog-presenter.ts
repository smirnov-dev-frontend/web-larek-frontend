import { EventEmitter } from '../components/base/Events';
import type { IApiClient, ICartModel, IProductModel, IProductListView, ApiProduct } from '../types';
import { AppEvent } from '../types';
import { ProductPreviewView } from '../views/product-preview';
import { Modal } from '../views/modal';

type CreateCatalogCard = (product: ApiProduct) => HTMLElement;

export class CatalogPresenter {
   constructor(
      private readonly apiClient: IApiClient,
      private readonly productModel: IProductModel,
      private readonly cartModel: ICartModel,
      private readonly productListView: IProductListView,
      private readonly productPreviewView: ProductPreviewView,
      private readonly createCatalogCard: CreateCatalogCard,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

   init(): void {
      this.events.on(AppEvent.CATALOG_CHANGED, () => {
         this.renderCatalog();
      });

      this.events.on(AppEvent.CART_CHANGED, () => {
         this.renderCatalog();

         if (this.productModel.getSelectedProduct()) {
            this.renderPreview();
         }
      });

      this.events.on(AppEvent.PREVIEW_TOGGLE, () => {
         this.togglePreviewProduct();
      });

      this.events.on(AppEvent.MODAL_CLOSE, () => {
         this.productModel.clearSelectedProduct();
      });

      void this.bootstrap();
   }

   private async bootstrap(): Promise<void> {
      try {
         const products = await this.apiClient.getProducts();
         this.productModel.setProducts(products);
      } catch (error) {
         console.error(error);
      }
   }

   private renderCatalog(): void {
      const products = this.productModel.getProducts();
      const nodes = products.map((product) => this.createCatalogCard(product));
      this.productListView.items = nodes;
      this.productListView.render();
   }

   private openPreview(): void {
      this.renderPreview();
      this.modal.setContent(this.productPreviewView.render());
      this.modal.open();
   }

   private renderPreview(): void {
      const product = this.productModel.getSelectedProduct();
      if (!product) return;

      const isInCart = this.cartModel.hasProduct(product.id);
      const buttonDisabled = product.price === null;
      const buttonText = buttonDisabled ? 'Недоступно' : isInCart ? 'Убрать' : 'Купить';

      this.productPreviewView.render(
         ProductPreviewView.fromProduct(product, buttonText, buttonDisabled)
      );
   }

   private togglePreviewProduct(): void {
      const product = this.productModel.getSelectedProduct();
      if (!product || product.price === null) return;

      if (this.cartModel.hasProduct(product.id)) {
         this.cartModel.removeProduct(product.id);
      } else {
         this.cartModel.addProduct(product);
      }
   }

   selectProduct(product: ApiProduct): void {
      this.productModel.setSelectedProduct(product);
      this.openPreview();
   }
}
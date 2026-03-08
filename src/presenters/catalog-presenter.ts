import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import type { ICartModel, IProductModel, IProductListView, ApiProduct } from '../types';
import { AppEvent } from '../types';
import { ProductCardView } from '../views/product-card';
import { ProductPreviewView } from '../views/product-preview';
import { Modal } from '../views/modal';

function formatPrice(price: number | null): string {
   return price === null ? 'Бесценно' : `${price} синапсов`;
}

type CardWithMedia = ProductCardView & { category: string; image: string };

export class CatalogPresenter {
   constructor(
      private readonly productModel: IProductModel,
      private readonly cartModel: ICartModel,
      private readonly productListView: IProductListView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

   init(): void {
      this.events.on(AppEvent.PRODUCT_SELECTED, (e: { productId: string }) => {
         this.productModel.setSelectedProduct(e.productId);
         this.openPreview();
      });

      this.events.on(AppEvent.CART_CHANGED, () => {
         this.renderCatalog();
      });

      this.events.on(AppEvent.MODAL_CLOSE, () => {
         this.productModel.clearSelectedProduct();
      });

      void this.bootstrap();
   }

   private async bootstrap(): Promise<void> {
      await this.productModel.loadProducts();
      this.renderCatalog();
   }

   private renderCatalog(): void {
      const products = this.productModel.getProducts();
      const nodes = products.map((product) => this.createCardNode(product));
      this.productListView.render(nodes);
   }

   private createCardNode(product: ApiProduct): HTMLElement {
      const node = cloneTemplate<HTMLButtonElement>('#card-catalog');
      const card = new ProductCardView(node, this.events);

      const cardWithMedia = card as CardWithMedia;
      cardWithMedia.category = product.category;
      cardWithMedia.image = product.image;

      card.render({
         id: product.id,
         title: product.title,
         price: formatPrice(product.price),
         isInCart: this.cartModel.hasProduct(product.id),
      });

      return node;
   }

   private openPreview(): void {
      const product = this.productModel.getSelectedProduct();
      if (!product) return;

      const node = cloneTemplate<HTMLElement>('#card-preview');
      const preview = new ProductPreviewView(node, this.events);

      preview.render(
         ProductPreviewView.fromProduct(
            product,
            this.cartModel.hasProduct(product.id)
         )
      );

      this.modal.setContent(node);
      this.modal.open();
   }
}
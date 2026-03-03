import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import type { IProductModel, IProductListView, ApiProduct, ICartModel } from '../types';
import { AppEvent } from '../types';
import { ProductCardView } from '../views/product-card';
import { ProductPreviewView } from '../views/product-preview';
import { Modal } from '../views/modal';

function formatPrice(price: number | null): string {
   return price === null ? 'Бесценно' : `${price} синапсов`;
}

export class CatalogPresenter {
   private cards: Map<string, ProductCardView> = new Map();

   constructor(
      private readonly productModel: IProductModel,
      private readonly cartModel: ICartModel,
      private readonly productListView: IProductListView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

   init(): void {
      this.events.on(AppEvent.PRODUCT_SELECTED, (e: { productId: string }) =>
         this.openPreview(e.productId)
      );

      this.events.on(AppEvent.CART_ADD, (e: { productId: string }) =>
         this.addToCart(e.productId)
      );

      this.events.on(AppEvent.CART_REMOVE, (e: { productId: string }) =>
         this.removeFromCart(e.productId)
      );

      this.events.on(AppEvent.CART_CLEAR, () => this.renderCatalog());

      void this.bootstrap();
   }

   private async bootstrap(): Promise<void> {
      await this.productModel.loadProducts();
      this.renderCatalog();
   }

   private renderCatalog(): void {
      const products = this.productModel.getProducts();
      const nodes = products.map(p => this.createCardNode(p));
      this.productListView.render(nodes);
   }

   private createCardNode(product: ApiProduct): HTMLElement {
      const node = cloneTemplate<HTMLButtonElement>('#card-catalog');

      const card = new ProductCardView(node, this.events);

      (card as any).category = product.category;
      (card as any).image = product.image;

      card.render({
         id: product.id,
         title: product.title,
         price: formatPrice(product.price),
         isInCart: this.cartModel.hasProduct(product.id),
      });

      this.cards.set(product.id, card);
      return node;
   }

   private openPreview(productId: string): void {
      const product = this.productModel.getProductById(productId);
      if (!product) return;

      const node = cloneTemplate<HTMLElement>('#card-preview');
      const preview = new ProductPreviewView(node, this.events);

      preview.render(
         ProductPreviewView.fromProduct(
            product,
            this.cartModel.hasProduct(productId)
         )
      );

      this.modal.setContent(node);
      this.modal.open();
   }

   private addToCart(productId: string): void {
      const product = this.productModel.getProductById(productId);
      if (!product) return;

      this.cartModel.addProduct(product);

      this.renderCatalog();
   }

   private removeFromCart(productId: string): void {
      this.cartModel.removeProduct(productId);

      this.renderCatalog();
   }
}
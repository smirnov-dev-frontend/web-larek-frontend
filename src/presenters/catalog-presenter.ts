import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import type { IProductModel, IProductListView, ApiProduct } from '../types';
import { AppEvent } from '../types';
import { ProductCardView } from '../views/product-card';
import { ProductPreviewView } from '../views/product-preview';
import { Modal } from '../views/modal';

function formatPrice(price: number | null): string {
   return price === null ? 'Бесценно' : `${price} синапсов`;
}

type CardWithMedia = ProductCardView & { category: string; image: string };

export class CatalogPresenter {
   private cards: Map<string, ProductCardView> = new Map();
   private cartIds: Set<string> = new Set();

   constructor(
      private readonly productModel: IProductModel,
      private readonly productListView: IProductListView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

   init(): void {
      this.events.on(AppEvent.PRODUCT_SELECTED, (e: { productId: string }) => this.openPreview(e.productId));

      this.events.on(AppEvent.CART_ADD, (e: { productId: string }) => {
         this.cartIds.add(e.productId);
         this.updateCardState(e.productId);
      });

      this.events.on(AppEvent.CART_REMOVE, (e: { productId: string }) => {
         this.cartIds.delete(e.productId);
         this.updateCardState(e.productId);
      });

      this.events.on(AppEvent.CART_CLEAR, () => {
         this.cartIds.clear();
         this.renderCatalog();
      });

      void this.bootstrap();
   }

   private async bootstrap(): Promise<void> {
      await this.productModel.loadProducts();
      this.renderCatalog();
   }

   private renderCatalog(): void {
      const products = this.productModel.getProducts();
      const nodes = products.map((p) => this.createCardNode(p));
      this.productListView.render(nodes);
   }

   private updateCardState(productId: string): void {
      const card = this.cards.get(productId);
      if (!card) return;

      card.render({
         isInCart: this.cartIds.has(productId),
      } as unknown as Partial<unknown>);
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
         isInCart: this.cartIds.has(product.id),
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
            this.cartIds.has(productId)
         )
      );

      this.modal.setContent(node);
      this.modal.open();
   }
}
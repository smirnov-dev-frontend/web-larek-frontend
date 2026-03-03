import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import { AppEvent } from '../types';
import type { ICartModel, IProductModel, ApiProduct } from '../types';
import { Modal } from '../views/modal';
import { BasketView } from '../views/basket';
import { BasketItemView } from '../views/basket-item';
import { HeaderBasketView } from '../views/header-basket';

function formatPrice(price: number | null): string {
   return price === null ? 'Бесценно' : `${price} синапсов`;
}

export class CartPresenter {
   private isCartOpen = false;

   constructor(
      private readonly cartModel: ICartModel,
      private readonly productModel: IProductModel,
      private readonly headerBasket: HeaderBasketView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }
   init(): void {
      this.events.on(AppEvent.CART_OPEN, () => this.openCart());
      this.events.on(AppEvent.CART_ADD, (e: { productId: string }) => this.onAdd(e.productId));
      this.events.on(AppEvent.CART_REMOVE, (e: { productId: string }) => this.onRemove(e.productId));

      this.events.on(AppEvent.CART_CLEAR, () => {
         this.syncCounter();
         if (this.isCartOpen) this.renderCartIntoModal();
      });

      this.events.on(AppEvent.MODAL_CLOSE, () => {
         this.isCartOpen = false;
      });
      this.events.on(AppEvent.ORDER_SUBMIT, () => {
         this.isCartOpen = false;
      });

      this.syncCounter();
   }

   private syncCounter(): void {
      this.headerBasket.setCount(this.cartModel.getItems().length);
   }

   private onAdd(productId: string): void {
      const product = this.productModel.getProductById(productId);
      if (!product) return;

      this.cartModel.addProduct(product);
      this.syncCounter();

      if (this.isCartOpen) {
         this.renderCartIntoModal();
      }
   }

   private onRemove(productId: string): void {
      this.cartModel.removeProduct(productId);
      this.syncCounter();

      if (this.isCartOpen) {
         this.renderCartIntoModal();
      }
   }

   private openCart(): void {
      this.isCartOpen = true;
      this.renderCartIntoModal();
   }

   private renderCartIntoModal(): void {
      const basketRoot = cloneTemplate<HTMLElement>('#basket');
      const basket = new BasketView(basketRoot);

      const items = this.cartModel.getItems();
      const itemNodes = items.map((p, idx) => this.createBasketItemNode(p, idx + 1));
      basket.setItems(itemNodes);

      const total = this.cartModel.getTotalPrice();
      basket.setTotal(`${total} синапсов`);

      basket.setOrderEnabled(items.length > 0);
      basket.onOrderClick(() => {
         this.events.emit(AppEvent.ORDER_SUBMIT, { timestamp: Date.now() });
      });

      this.modal.setContent(basket.getElement());
      this.modal.open();
   }

   private createBasketItemNode(product: ApiProduct, index: number): HTMLElement {
      const node = cloneTemplate<HTMLElement>('#card-basket');
      const item = new BasketItemView(node, this.events);

      item.render({
         index,
         title: product.title,
         priceText: formatPrice(product.price),
         productId: product.id,
      });

      return node;
   }
}
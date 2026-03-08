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
   private readonly basketView: BasketView;

   constructor(
      private readonly cartModel: ICartModel,
      private readonly productModel: IProductModel,
      private readonly headerBasket: HeaderBasketView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) {
      const basketRoot = cloneTemplate<HTMLElement>('#basket');
      this.basketView = new BasketView(basketRoot, this.events);
   }

   init(): void {
      this.events.on(AppEvent.CART_OPEN, () => this.openCart());
      this.events.on(AppEvent.CART_ADD, (e: { productId: string }) => this.onAdd(e.productId));
      this.events.on(AppEvent.CART_REMOVE, (e: { productId: string }) => this.onRemove(e.productId));
      this.events.on(AppEvent.CART_CLEAR, () => this.cartModel.clear());
      this.events.on(AppEvent.CART_CHANGED, () => this.updateView());

      this.updateView();
   }

   private updateView(): void {
      this.headerBasket.setCount(this.cartModel.getCount());

      const itemNodes = this.cartModel
         .getItems()
         .map((product, index) => this.createBasketItemNode(product, index + 1));

      this.basketView.render({
         items: itemNodes,
         total: `${this.cartModel.getTotalPrice()} синапсов`,
         orderEnabled: this.cartModel.getCount() > 0,
      });
   }

   private onAdd(productId: string): void {
      const product = this.productModel.getProductById(productId);
      if (!product) return;

      this.cartModel.addProduct(product);
   }

   private onRemove(productId: string): void {
      this.cartModel.removeProduct(productId);
   }

   private openCart(): void {
      this.modal.setContent(this.basketView.render());
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
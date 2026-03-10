import { EventEmitter } from '../components/base/Events';
import { AppEvent } from '../types';
import type { ICartModel, IProductModel, ApiProduct } from '../types';
import { Modal } from '../views/modal';
import { BasketView } from '../views/basket';
import { HeaderBasketView } from '../views/header-basket';

type CreateBasketItem = (product: ApiProduct, index: number) => HTMLElement;

export class CartPresenter {
   constructor(
      private readonly cartModel: ICartModel,
      private readonly productModel: IProductModel,
      private readonly headerBasket: HeaderBasketView,
      private readonly basketView: BasketView,
      private readonly createBasketItem: CreateBasketItem,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

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
         .map((product, index) => this.createBasketItem(product, index + 1));

      this.basketView.render({
         items: itemNodes,
         total: `${this.cartModel.getTotalPrice()} синапсов`,
         orderEnabled: this.cartModel.getCount() > 0,
      });
   }

   private onAdd(productId: string): void {
      const product = this.productModel.getProductById(productId);
      if (!product || product.price === null) return;

      this.cartModel.addProduct(product);
   }

   private onRemove(productId: string): void {
      this.cartModel.removeProduct(productId);
   }

   private openCart(): void {
      this.modal.setContent(this.basketView.render());
      this.modal.open();
   }
}
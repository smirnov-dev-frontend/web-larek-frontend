import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { CDN_URL, categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';
import type { ApiProduct } from '../types';

type PreviewData = {
   id: string;
   title: string;
   description: string;
   priceText: string;
   category: string;
   image: string;
   isInCart: boolean;
};

export class ProductPreviewView extends Component<PreviewData> {
   private id = '';
   private _isInCart = false;

   private readonly titleEl: HTMLElement;
   private readonly textEl: HTMLElement;
   private readonly priceEl: HTMLElement;
   private readonly imageEl: HTMLImageElement;
   private readonly categoryEl: HTMLElement;
   private readonly buttonEl: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.titleEl = ensureElement('.card__title', container);
      this.textEl = ensureElement('.card__text', container);
      this.priceEl = ensureElement('.card__price', container);
      this.imageEl = ensureElement<HTMLImageElement>('.card__image', container);
      this.categoryEl = ensureElement('.card__category', container);
      this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', container);

      this.buttonEl.addEventListener('click', () => {
         this.isInCart = !this._isInCart;

         if (this._isInCart) {
            this.events.emit(AppEvent.CART_ADD, { productId: this.id });
         } else {
            this.events.emit(AppEvent.CART_REMOVE, { productId: this.id });
         }
      });
   }

   set title(value: string) {
      this.titleEl.textContent = value;
   }

   set description(value: string) {
      this.textEl.textContent = value;
   }

   set priceText(value: string) {
      this.priceEl.textContent = value;
   }

   set category(value: string) {
      this.categoryEl.textContent = value;
      const mod = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
      this.categoryEl.className = `card__category ${mod}`;
   }

   set image(value: string) {
      this.setImage(this.imageEl, `${CDN_URL}${value}`, this.titleEl.textContent ?? '');
   }

   set isInCart(value: boolean) {
      this._isInCart = value;
      this.buttonEl.textContent = value ? 'Убрать' : 'В корзину';
   }

   static fromProduct(product: ApiProduct, isInCart: boolean): PreviewData {
      const priceText = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
      return {
         id: product.id,
         title: product.title,
         description: product.description,
         priceText,
         category: product.category,
         image: product.image,
         isInCart,
      };
   }
}
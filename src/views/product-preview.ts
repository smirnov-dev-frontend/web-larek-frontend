import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { CDN_URL, categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import type { ApiProduct } from '../types';
import { AppEvent } from '../types';

export type ProductPreviewData = {
   id: string;
   title: string;
   description: string;
   priceText: string;
   image: string;
   category: string;
   isInCart: boolean;
};

function formatPrice(price: number | null): string {
   return price === null ? 'Бесценно' : `${price} синапсов`;
}

export class ProductPreviewView extends Component<ProductPreviewData> {
   private id = '';
   private inCart = false;

   private readonly titleEl: HTMLElement;
   private readonly priceEl: HTMLElement;
   private readonly imageEl: HTMLImageElement;
   private readonly categoryEl: HTMLElement;
   private readonly descEl: HTMLElement;
   private readonly actionBtn: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.titleEl = ensureElement('.card__title', container);
      this.priceEl = ensureElement('.card__price', container);
      this.imageEl = ensureElement<HTMLImageElement>('.card__image', container);
      this.categoryEl = ensureElement('.card__category', container);
      this.descEl = ensureElement('.card__text', container);
      this.actionBtn = ensureElement<HTMLButtonElement>('.card__button', container);

      this.actionBtn.addEventListener('click', () => {
         if (!this.id) return;

         if (this.inCart) {
            this.events.emit(AppEvent.CART_REMOVE, { productId: this.id });
            this.isInCart = false;
         } else {
            this.events.emit(AppEvent.CART_ADD, { productId: this.id });
            this.isInCart = true;
         }
      });
   }

   set title(value: string) {
      this.titleEl.textContent = value;
   }

   set description(value: string) {
      this.descEl.textContent = value;
   }

   set priceText(value: string) {
      this.priceEl.textContent = value;
   }

   set image(value: string) {
      const path = value.startsWith('/') ? value.slice(1) : value;
      this.setImage(this.imageEl, `${CDN_URL}${path}`, this.titleEl.textContent ?? '');
   }

   set category(value: string) {
      this.categoryEl.textContent = value;
      const mod = categoryMap[value] ?? categoryMap['другое'];
      this.categoryEl.className = `card__category ${mod}`;
   }

   set isInCart(value: boolean) {
      this.inCart = value;
      this.actionBtn.textContent = value ? 'Убрать' : 'Купить';
   }

   static fromProduct(product: ApiProduct, isInCart: boolean): ProductPreviewData {
      return {
         id: product.id,
         title: product.title,
         description: product.description,
         priceText: formatPrice(product.price),
         image: product.image,
         category: product.category,
         isInCart,
      };
   }
}
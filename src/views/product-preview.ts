import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { CDN_URL, categoryMap } from '../utils/constants';
import { ensureElement, formatPrice } from '../utils/utils';
import type { ApiProduct } from '../types';
import { AppEvent } from '../types';

export type ProductPreviewData = {
   title: string;
   description: string;
   priceText: string;
   image: string;
   category: string;
   buttonText: string;
   buttonDisabled: boolean;
};

export class ProductPreviewView extends Component<ProductPreviewData> {
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
         this.events.emit(AppEvent.PREVIEW_TOGGLE, {});
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
      const mod = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
      this.categoryEl.className = `card__category ${mod}`;
   }

   set buttonText(value: string) {
      this.actionBtn.textContent = value;
   }

   set buttonDisabled(value: boolean) {
      this.actionBtn.disabled = value;
   }

   static fromProduct(
      product: ApiProduct,
      buttonText: string,
      buttonDisabled: boolean
   ): ProductPreviewData {
      return {
         title: product.title,
         description: product.description,
         priceText: formatPrice(product.price),
         image: product.image,
         category: product.category,
         buttonText,
         buttonDisabled,
      };
   }
}
import { Component } from '../components/base/Component';
import { CDN_URL, categoryMap } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import type { ProductCardViewData } from '../types';

type CardContainer = HTMLButtonElement;

type ProductCardActions = {
   onClick: () => void;
};

export class ProductCardView extends Component<ProductCardViewData> {
   private readonly titleEl: HTMLElement;
   private readonly priceEl: HTMLElement;
   private readonly imageEl: HTMLImageElement;
   private readonly categoryEl: HTMLElement;

   constructor(container: CardContainer, actions: ProductCardActions) {
      super(container);

      this.titleEl = ensureElement('.card__title', container);
      this.priceEl = ensureElement('.card__price', container);
      this.imageEl = ensureElement<HTMLImageElement>('.card__image', container);
      this.categoryEl = ensureElement('.card__category', container);

      container.addEventListener('click', actions.onClick);
   }

   set category(value: string) {
      this.categoryEl.textContent = value;
      const mod = categoryMap[value as keyof typeof categoryMap] ?? categoryMap['другое'];
      this.categoryEl.className = `card__category ${mod}`;
   }

   set image(value: string) {
      this.setImage(this.imageEl, `${CDN_URL}${value}`, this.titleEl.textContent ?? '');
   }

   set title(value: string) {
      this.titleEl.textContent = value;
   }

   set price(value: string) {
      this.priceEl.textContent = value;
   }

   set isInCart(value: boolean) {
      this.container.classList.toggle('card_in-cart', value);
      this.container.setAttribute('data-in-cart', value ? 'true' : 'false');
   }

   setSelected(selected: boolean): void {
      this.container.classList.toggle('card_selected', selected);
   }
}
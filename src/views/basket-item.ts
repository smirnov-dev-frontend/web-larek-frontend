import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

type BasketItemData = {
   index: number;
   title: string;
   priceText: string;
   productId: string;
};

export class BasketItemView extends Component<BasketItemData> {
   private _productId = '';

   private readonly indexEl: HTMLElement;
   private readonly titleEl: HTMLElement;
   private readonly priceEl: HTMLElement;
   private readonly deleteBtn: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.indexEl = ensureElement('.basket__item-index', container);
      this.titleEl = ensureElement('.card__title', container);
      this.priceEl = ensureElement('.card__price', container);
      this.deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

      this.deleteBtn.addEventListener('click', () => {
         this.events.emit(AppEvent.CART_REMOVE, { productId: this._productId });
      });
   }

   set index(value: number) {
      this.indexEl.textContent = String(value);
   }

   set title(value: string) {
      this.titleEl.textContent = value;
   }

   set priceText(value: string) {
      this.priceEl.textContent = value;
   }

   set productId(value: string) {
      this._productId = value;
   }
}
import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';

type BasketItemData = {
   index: number;
   title: string;
   priceText: string;
};

type BasketItemActions = {
   onDelete: () => void;
};

export class BasketItemView extends Component<BasketItemData> {
   private readonly indexEl: HTMLElement;
   private readonly titleEl: HTMLElement;
   private readonly priceEl: HTMLElement;
   private readonly deleteBtn: HTMLButtonElement;

   constructor(container: HTMLElement, actions: BasketItemActions) {
      super(container);

      this.indexEl = ensureElement('.basket__item-index', container);
      this.titleEl = ensureElement('.card__title', container);
      this.priceEl = ensureElement('.card__price', container);
      this.deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

      this.deleteBtn.addEventListener('click', actions.onDelete);
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
}
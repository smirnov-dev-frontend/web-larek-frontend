import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

type BasketViewData = {
   items: HTMLElement[];
   total: string;
   orderEnabled: boolean;
};

export class BasketView extends Component<BasketViewData> {
   private readonly list: HTMLElement;
   private readonly totalEl: HTMLElement;
   private readonly orderButton: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.list = ensureElement<HTMLElement>('.basket__list', container);
      this.totalEl = ensureElement<HTMLElement>('.basket__price', container);
      this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

      this.orderButton.addEventListener('click', () => {
         this.events.emit(AppEvent.ORDER_SUBMIT, { timestamp: Date.now() });
      });
   }

   set items(items: HTMLElement[]) {
      this.list.replaceChildren(...items);
   }

   set total(value: string) {
      this.totalEl.textContent = value;
   }

   set orderEnabled(enabled: boolean) {
      this.orderButton.disabled = !enabled;
   }
}
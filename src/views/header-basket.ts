import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

export class HeaderBasketView {
   private readonly button: HTMLButtonElement;
   private readonly counter: HTMLElement;

   constructor(root: HTMLElement, private readonly events: EventEmitter) {
      this.button = ensureElement<HTMLButtonElement>('.header__basket', root);
      this.counter = ensureElement<HTMLElement>('.header__basket-counter', root);

      this.button.addEventListener('click', () => {
         this.events.emit(AppEvent.CART_OPEN, {});
      });
   }

   setCount(count: number): void {
      this.counter.textContent = String(count);
   }
}
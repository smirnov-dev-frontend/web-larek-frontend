import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

export class OrderSuccessView extends Component<undefined> {
   private readonly descEl: HTMLElement;
   private readonly closeBtn: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.descEl = ensureElement<HTMLElement>('.order-success__description', container);
      this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', container);

      this.closeBtn.addEventListener('click', () => {
         this.events.emit(AppEvent.ORDER_SUCCESS_CLOSE, {});
      });
   }

   setTotal(total: number): void {
      this.descEl.textContent = `Списано ${total} синапсов`;
   }
}
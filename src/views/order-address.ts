import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';
import type { PaymentMethod } from '../types';

type OrderAddressViewData = {
   payment: PaymentMethod | null;
   address: string;
   errors: string;
   valid: boolean;
};

export class OrderAddressView extends Component<OrderAddressViewData> {
   private readonly form: HTMLFormElement;
   private readonly addressInput: HTMLInputElement;
   private readonly errorEl: HTMLElement;
   private readonly submitBtn: HTMLButtonElement;
   private readonly payCardBtn: HTMLButtonElement;
   private readonly payCashBtn: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.form =
         container instanceof HTMLFormElement
            ? container
            : ensureElement<HTMLFormElement>('form[name="order"]', container);

      this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
      this.errorEl = ensureElement<HTMLElement>('.form__errors', this.form);
      this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
      this.payCardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
      this.payCashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);

      this.payCardBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.events.emit(AppEvent.ORDER_FIELD_CHANGE, {
            field: 'payment',
            value: 'card',
         });
      });

      this.payCashBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.events.emit(AppEvent.ORDER_FIELD_CHANGE, {
            field: 'payment',
            value: 'cash',
         });
      });

      this.addressInput.addEventListener('input', () => {
         this.events.emit(AppEvent.ORDER_FIELD_CHANGE, {
            field: 'address',
            value: this.addressInput.value,
         });
      });

      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         this.events.emit(AppEvent.ORDER_ADDRESS_SUBMIT, {});
      });
   }

   set payment(value: PaymentMethod | null) {
      const isCard = value === 'card';
      const isCash = value === 'cash';

      this.payCardBtn.classList.toggle('button_alt-active', isCard);
      this.payCashBtn.classList.toggle('button_alt-active', isCash);

      this.payCardBtn.setAttribute('aria-pressed', String(isCard));
      this.payCashBtn.setAttribute('aria-pressed', String(isCash));
   }

   set address(value: string) {
      this.addressInput.value = value;
   }

   set errors(value: string) {
      this.errorEl.textContent = value;
   }

   set valid(value: boolean) {
      this.submitBtn.disabled = !value;
   }
}
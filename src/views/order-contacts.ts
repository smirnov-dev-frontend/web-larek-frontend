import { Component } from '../components/base/Component';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

type OrderContactsViewData = {
   email: string;
   phone: string;
   errors: string;
   valid: boolean;
};

export class OrderContactsView extends Component<OrderContactsViewData> {
   private readonly form: HTMLFormElement;
   private readonly emailInput: HTMLInputElement;
   private readonly phoneInput: HTMLInputElement;
   private readonly errorEl: HTMLElement;
   private readonly submitBtn: HTMLButtonElement;

   constructor(container: HTMLElement, private readonly events: EventEmitter) {
      super(container);

      this.form =
         container instanceof HTMLFormElement
            ? container
            : ensureElement<HTMLFormElement>('form[name="contacts"]', container);

      this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
      this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
      this.errorEl = ensureElement<HTMLElement>('.form__errors', this.form);
      this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

      this.emailInput.addEventListener('input', () => {
         this.events.emit(AppEvent.ORDER_FIELD_CHANGE, {
            field: 'email',
            value: this.emailInput.value.trim(),
         });
      });

      this.phoneInput.addEventListener('input', () => {
         const masked = this.applyPhoneMask(this.phoneInput.value);
         this.phoneInput.value = masked;

         this.events.emit(AppEvent.ORDER_FIELD_CHANGE, {
            field: 'phone',
            value: masked,
         });
      });

      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         this.events.emit(AppEvent.ORDER_CONTACTS_SUBMIT, {});
      });
   }

   private applyPhoneMask(value: string): string {
      const digits = value.replace(/\D/g, '').slice(0, 11);

      let formatted = '';

      if (digits.length > 0) {
         formatted = '+7';

         const body = digits.startsWith('7') ? digits.slice(1) : digits;

         if (body.length > 0) {
            formatted += ` (${body.slice(0, 3)}`;
         }
         if (body.length >= 3) {
            formatted += ')';
         }
         if (body.length > 3) {
            formatted += ` ${body.slice(3, 6)}`;
         }
         if (body.length > 6) {
            formatted += `-${body.slice(6, 8)}`;
         }
         if (body.length > 8) {
            formatted += `-${body.slice(8, 10)}`;
         }
      }

      return formatted;
   }

   set email(value: string) {
      this.emailInput.value = value;
   }

   set phone(value: string) {
      this.phoneInput.value = value;
   }

   set errors(value: string) {
      this.errorEl.textContent = value;
   }

   set valid(value: boolean) {
      this.submitBtn.disabled = !value;
   }
}
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

const MIN_PHONE_DIGITS = 10;

export class OrderContactsView {
   private readonly form: HTMLFormElement;
   private readonly emailInput: HTMLInputElement;
   private readonly phoneInput: HTMLInputElement;
   private readonly errorEl: HTMLElement;
   private readonly submitBtn: HTMLButtonElement;

   constructor(private readonly container: HTMLElement, private readonly events: EventEmitter) {
      this.form =
         container instanceof HTMLFormElement
            ? container
            : ensureElement<HTMLFormElement>('form[name="contacts"]', container);

      this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
      this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);
      this.errorEl = ensureElement<HTMLElement>('.form__errors', this.form);
      this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

      this.emailInput.addEventListener('input', () => this.validate());
      this.emailInput.addEventListener('blur', () => this.validate(true));

      this.phoneInput.addEventListener('input', () => {
         this.applyPhoneMask();
         this.validate();
      });
      this.phoneInput.addEventListener('blur', () => this.validate(true));

      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         if (!this.validate(true)) return;

         this.events.emit(AppEvent.ORDER_CONTACTS_SUBMIT, {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
         });
      });

      this.validate();
   }

   private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return emailRegex.test(email);
   }

   private applyPhoneMask(): void {
      const digits = this.phoneInput.value.replace(/\D/g, '').slice(0, 11);

      let formatted = '';

      if (digits.length > 0) {
         formatted = '+7';

         const body = digits.startsWith('7') ? digits.slice(1) : digits;

         if (body.length > 0) {
            formatted += ' (' + body.slice(0, 3);
         }
         if (body.length >= 3) {
            formatted += ')';
         }
         if (body.length > 3) {
            formatted += ' ' + body.slice(3, 6);
         }
         if (body.length > 6) {
            formatted += '-' + body.slice(6, 8);
         }
         if (body.length > 8) {
            formatted += '-' + body.slice(8, 10);
         }
      }

      this.phoneInput.value = formatted;
   }

   private digitsCount(value: string): number {
      const m = value.match(/\d/g);
      return m ? m.length : 0;
   }

   private setError(msg: string) {
      this.errorEl.textContent = msg;
   }

   private setSubmitEnabled(enabled: boolean) {
      this.submitBtn.disabled = !enabled;
   }

   private validate(showErrors = false): boolean {
      const email = this.emailInput.value.trim();
      const phone = this.phoneInput.value.trim();

      if (!email || !phone) {
         if (showErrors) this.setError('Заполните Email и Телефон');
         else this.setError('');
         this.setSubmitEnabled(false);
         return false;
      }

      if (!this.isValidEmail(email)) {
         if (showErrors) this.setError('Введите корректный Email (например: name@mail.ru)');
         else this.setError('');
         this.setSubmitEnabled(false);
         return false;
      }

      if (this.digitsCount(phone) < MIN_PHONE_DIGITS) {
         if (showErrors) this.setError(`Телефон должен содержать минимум ${MIN_PHONE_DIGITS} цифр`);
         else this.setError('');
         this.setSubmitEnabled(false);
         return false;
      }

      this.setError('');
      this.setSubmitEnabled(true);
      return true;
   }

   getElement(): HTMLElement {
      return this.container;
   }
}
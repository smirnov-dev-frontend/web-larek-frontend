import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';
import { AppEvent } from '../types';

type PaymentMethod = 'card' | 'cash';

export class OrderAddressView {
   private readonly form: HTMLFormElement;
   private readonly addressInput: HTMLInputElement;
   private readonly errorEl: HTMLElement;
   private readonly submitBtn: HTMLButtonElement;

   private readonly payCardBtn: HTMLButtonElement;
   private readonly payCashBtn: HTMLButtonElement;

   private payment: PaymentMethod | null;

   constructor(private readonly container: HTMLElement, private readonly events: EventEmitter) {
      this.form =
         container instanceof HTMLFormElement
            ? container
            : ensureElement<HTMLFormElement>('form[name="order"]', container);

      this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);
      this.errorEl = ensureElement<HTMLElement>('.form__errors', this.form);
      this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);

      this.payCardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
      this.payCashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);

      this.payment = null;

      this.payCardBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.setPayment('card');
         this.validate(true);
      });

      this.payCashBtn.addEventListener('click', (e) => {
         e.preventDefault();
         this.setPayment('cash');
         this.validate(true);
      });

      this.addressInput.addEventListener('input', () => this.validate());
      this.addressInput.addEventListener('blur', () => this.validate(true));

      this.form.addEventListener('submit', (e) => {
         e.preventDefault();
         if (!this.validate(true)) return;

         this.events.emit(AppEvent.ORDER_ADDRESS_SUBMIT, {
            address: this.addressInput.value.trim(),
            payment: this.payment!,
         });
      });

      this.updatePaymentUI();
      this.validate();
   }

   private setPayment(method: PaymentMethod) {
      this.payment = method;
      this.updatePaymentUI();
   }

   private updatePaymentUI() {
      const isCard = this.payment === 'card';
      const isCash = this.payment === 'cash';

      this.payCardBtn.classList.toggle('button_alt-active', isCard);
      this.payCashBtn.classList.toggle('button_alt-active', isCash);

      this.payCardBtn.setAttribute('aria-pressed', String(isCard));
      this.payCashBtn.setAttribute('aria-pressed', String(isCash));
   }

   private setError(msg: string) {
      this.errorEl.textContent = msg;
   }

   private setSubmitEnabled(enabled: boolean) {
      this.submitBtn.disabled = !enabled;
   }

   private validate(showErrors = false): boolean {
      const address = this.addressInput.value.trim();
      const hasPayment = this.payment === 'card' || this.payment === 'cash';

      if (!hasPayment || !address) {
         if (showErrors) {
            if (!hasPayment && !address) this.setError('Выберите способ оплаты и введите адрес доставки');
            else if (!hasPayment) this.setError('Выберите способ оплаты');
            else this.setError('Введите адрес доставки');
         } else {
            this.setError('');
         }
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
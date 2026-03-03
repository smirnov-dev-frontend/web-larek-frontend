import { ensureElement } from '../utils/utils';

export class BasketView {
   private readonly list: HTMLElement;
   private readonly total: HTMLElement;
   private readonly orderButton: HTMLButtonElement;

   constructor(private readonly container: HTMLElement) {
      this.list = ensureElement<HTMLElement>('.basket__list', container);
      this.total = ensureElement<HTMLElement>('.basket__price', container);
      this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);
   }

   setItems(items: HTMLElement[]): void {
      this.list.replaceChildren(...items);
   }

   setTotal(text: string): void {
      this.total.textContent = text;
   }

   setOrderEnabled(enabled: boolean): void {
      this.orderButton.disabled = !enabled;
   }

   onOrderClick(handler: () => void): void {
      this.orderButton.addEventListener('click', handler);
   }

   getElement(): HTMLElement {
      return this.container;
   }
}
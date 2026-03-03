import type { IProductListView } from '../types';

export class ProductListView implements IProductListView {
   constructor(private readonly container: HTMLElement) { }

   render(items: HTMLElement[]): HTMLElement {
      this.container.replaceChildren(...items);
      return this.container;
   }
}
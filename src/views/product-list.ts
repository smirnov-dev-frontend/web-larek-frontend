import { Component } from '../components/base/Component';
import type { IProductListView } from '../types';

export class ProductListView extends Component<undefined> implements IProductListView {
   constructor(container: HTMLElement) {
      super(container);
   }

   set items(items: HTMLElement[]) {
      this.container.replaceChildren(...items);
   }
}
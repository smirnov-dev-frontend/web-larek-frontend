import { ApiProduct } from './api';
import { IView, IModal } from './common';

export interface ProductCardViewData {
   id: string;
   title: string;
   price: string;
   isInCart: boolean;
}

export interface IProductCardView extends IView<ProductCardViewData> {
   setSelected(selected: boolean): void;
}

export interface IProductListView {
   render(items: HTMLElement[]): HTMLElement;
}

export interface ICartView {
   render(items: HTMLElement[], total: number): HTMLElement;
}

export interface IFormView {
   showError(message: string): void;
   clear(): void;
   setSubmitEnabled(enabled: boolean): void;
}

export interface IOrderContactsView extends IFormView { }

export interface IOrderAddressView extends IFormView { }

export interface IOrderSuccessView {
   render(total: number): HTMLElement;
}

export interface IModalView extends IModal { }
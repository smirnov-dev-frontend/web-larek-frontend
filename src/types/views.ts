import type { IView, IModal } from './common';
import type { PaymentMethod } from './api';

export interface ProductCardViewData {
   title: string;
   price: string;
   isInCart: boolean;
}

export interface IProductCardView extends IView<ProductCardViewData> {
   setSelected(selected: boolean): void;
}

export interface IProductListView extends IView<undefined> {
   set items(items: HTMLElement[]);
}

export interface BasketViewData {
   items: HTMLElement[];
   total: string;
   orderEnabled: boolean;
}

export interface ICartView extends IView<BasketViewData> { }

export interface OrderAddressViewData {
   payment: PaymentMethod | null;
   address: string;
   errors: string;
   valid: boolean;
}

export interface OrderContactsViewData {
   email: string;
   phone: string;
   errors: string;
   valid: boolean;
}

export interface IOrderAddressView extends IView<OrderAddressViewData> { }

export interface IOrderContactsView extends IView<OrderContactsViewData> { }

export interface IOrderSuccessView extends IView<undefined> {
   setTotal(total: number): void;
}

export interface IModalView extends IModal { }
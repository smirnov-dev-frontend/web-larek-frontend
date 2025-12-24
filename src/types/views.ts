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

export interface IProductListView extends IView<ProductCardViewData[]> { }

export interface ICartView extends IView<ApiProduct[]> {
   showTotal(total: number): void;
}

export interface IOrderFormView extends IView<void> {
   showError(message: string): void;
   clear(): void;
}

export interface IModalView extends IModal { }
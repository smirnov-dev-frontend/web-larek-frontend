import { ApiProduct, ApiOrderResponse } from './api';
import { OrderContactsSubmitEvent, OrderAddressSubmitEvent } from './events';

export interface IPresenter {
   init(): void;
   destroy(): void;
}

export interface ICatalogPresenter extends IPresenter {
   selectProduct(productId: string): void;
}

export interface ICartPresenter extends IPresenter {
   handleAddToCart(product: ApiProduct): void;
   handleRemoveFromCart(productId: string): void;
}

export interface IOrderPresenter extends IPresenter {
   handleContactsSubmit(data: OrderContactsSubmitEvent): void;
   handleAddressSubmit(data: OrderAddressSubmitEvent): void;
   handleOrderSuccess(orderResponse: ApiOrderResponse): void;
   reset(): void;
}
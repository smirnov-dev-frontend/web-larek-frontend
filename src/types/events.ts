import { PaymentMethod } from './api';

export enum AppEvent {
   PRODUCT_SELECTED = 'product:selected',
   CART_ADD = 'cart:add',
   CART_REMOVE = 'cart:remove',
   CART_CLEAR = 'cart:clear',

   ORDER_CONTACTS_SUBMIT = 'order:contacts:submit',
   ORDER_ADDRESS_SUBMIT = 'order:address:submit',
   ORDER_SUBMIT = 'order:submit',
   ORDER_SUCCESS = 'order:success',
   ORDER_SUCCESS_CLOSE = 'order:success:close',

   CART_OPEN = 'cart:open',

   MODAL_OPEN = 'modal:open',
   MODAL_CLOSE = 'modal:close',
}

export interface ProductSelectedEvent {
   productId: string;
}

export interface CartAddEvent {
   productId: string;
}

export interface CartRemoveEvent {
   productId: string;
}

export interface OrderContactsSubmitEvent {
   email: string;
   phone: string;
}

export interface OrderAddressSubmitEvent {
   address: string;
   payment: PaymentMethod;
}

export interface OrderSubmitEvent {
   timestamp?: number;
}

export interface OrderSuccessEvent {
   orderId: string;
   total: number;
}

export interface ModalOpenEvent {
   content?: HTMLElement | string;
}

export interface ModalCloseEvent {
   reason?: string;
}

export interface CartOpenEvent { }

export interface CartClearEvent { }
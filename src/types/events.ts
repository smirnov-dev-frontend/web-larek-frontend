import type { PaymentMethod } from './api';

export enum AppEvent {
   CATALOG_CHANGED = 'catalog:changed',

   PREVIEW_TOGGLE = 'preview:toggle',

   CART_OPEN = 'cart:open',
   CART_ADD = 'cart:add',
   CART_REMOVE = 'cart:remove',
   CART_CLEAR = 'cart:clear',
   CART_CHANGED = 'cart:changed',

   ORDER_SUBMIT = 'order:submit',
   ORDER_ADDRESS_SUBMIT = 'order:address:submit',
   ORDER_CONTACTS_SUBMIT = 'order:contacts:submit',
   ORDER_FIELD_CHANGE = 'order:field:change',
   ORDER_CHANGED = 'order:changed',
   ORDER_SUCCESS = 'order:success',
   ORDER_SUCCESS_CLOSE = 'order:success:close',

   MODAL_OPEN = 'modal:open',
   MODAL_CLOSE = 'modal:close',
}

export interface CartAddEvent {
   productId: string;
}

export interface CartRemoveEvent {
   productId: string;
}

export interface OrderFieldChangeEvent {
   field: 'payment' | 'address' | 'email' | 'phone';
   value: PaymentMethod | string;
}

export interface OrderAddressSubmitEvent { }

export interface OrderContactsSubmitEvent { }

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
export enum AppEvent {
   PRODUCT_SELECTED = 'product:selected',
   CART_ADD = 'cart:add',
   CART_REMOVE = 'cart:remove',
   ORDER_SUBMIT = 'order:submit',
   ORDER_SUCCESS = 'order:success',
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

export interface OrderSuccessEvent {
   orderId: string;
   total: number;
}
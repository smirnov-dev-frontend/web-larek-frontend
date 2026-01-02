export enum AppEvent {
   PRODUCT_SELECTED = 'product:selected',
   CART_ADD = 'cart:add',
   CART_REMOVE = 'cart:remove',

   ORDER_CONTACTS_SUBMIT = 'order:contacts:submit',
   ORDER_ADDRESS_SUBMIT = 'order:address:submit',
   ORDER_SUBMIT = 'order:submit',
   ORDER_SUCCESS = 'order:success',
   ORDER_SUCCESS_CLOSE = 'order:success:close',
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
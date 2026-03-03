import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import { AppEvent } from '../types';
import type { ICartModel, IOrderModel, ApiOrderRequest, PaymentMethod } from '../types';
import { Modal } from '../views/modal';
import { OrderAddressView } from '../views/order-address';
import { OrderContactsView } from '../views/order-contacts';
import { OrderSuccessView } from '../views/order-success';

export class OrderPresenter {
   private payment: PaymentMethod | null = null;
   private address = '';
   private email = '';
   private phone = '';

   constructor(
      private readonly orderModel: IOrderModel,
      private readonly cartModel: ICartModel,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

   init(): void {
      this.events.on(AppEvent.ORDER_SUBMIT, () => this.openAddressStep());

      this.events.on(AppEvent.ORDER_ADDRESS_SUBMIT, (e: { address: string; payment: PaymentMethod }) => {
         this.payment = e.payment;
         this.address = e.address;
         this.openContactsStep();
      });

      this.events.on(AppEvent.ORDER_CONTACTS_SUBMIT, (e: { email: string; phone: string }) => {
         this.email = e.email;
         this.phone = e.phone;
         void this.pay();
      });

      this.events.on(AppEvent.ORDER_SUCCESS_CLOSE, () => {
         this.modal.close();
         this.reset();
      });
   }

   private openAddressStep(): void {
      const node = cloneTemplate<HTMLElement>('#order');
      const view = new OrderAddressView(node, this.events);
      this.modal.setContent(view.getElement());
      this.modal.open();
   }

   private openContactsStep(): void {
      const node = cloneTemplate<HTMLElement>('#contacts');
      const view = new OrderContactsView(node, this.events);
      this.modal.setContent(view.getElement());
      this.modal.open();
   }

   private async pay(): Promise<void> {
      if (!this.payment) return;

      const items = this.cartModel.getItems();
      if (items.length === 0) return;

      const total = this.cartModel.getTotalPrice();

      const req: ApiOrderRequest = {
         items: items.map(i => i.id),
         total,
         payment: this.payment,
         address: this.address,
         email: this.email,
         phone: this.phone,
      };

      const res = await this.orderModel.createOrder(req);

      const node = cloneTemplate<HTMLElement>('#success');
      const success = new OrderSuccessView(node, this.events);
      success.setTotal(res.total);

      this.modal.setContent(success.getElement());
      this.modal.open();

      this.cartModel.clear();
      this.events.emit(AppEvent.CART_CLEAR, {});
   }

   private reset(): void {
      this.payment = null;
      this.address = '';
      this.email = '';
      this.phone = '';
   }
}
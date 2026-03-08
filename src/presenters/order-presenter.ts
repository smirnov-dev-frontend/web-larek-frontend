import { EventEmitter } from '../components/base/Events';
import { cloneTemplate } from '../utils/utils';
import { AppEvent } from '../types';
import type {
   IApiClient,
   ICartModel,
   IOrderModel,
   ApiOrderRequest,
   OrderFormData,
   OrderValidationErrors,
} from '../types';
import { Modal } from '../views/modal';
import { OrderAddressView } from '../views/order-address';
import { OrderContactsView } from '../views/order-contacts';
import { OrderSuccessView } from '../views/order-success';

function getAddressErrors(errors: OrderValidationErrors): string {
   return [errors.payment, errors.address].filter(Boolean).join('. ');
}

function getContactsErrors(errors: OrderValidationErrors): string {
   return [errors.email, errors.phone].filter(Boolean).join('. ');
}

export class OrderPresenter {
   private readonly addressView: OrderAddressView;
   private readonly contactsView: OrderContactsView;
   private readonly successView: OrderSuccessView;

   constructor(
      private readonly orderModel: IOrderModel,
      private readonly cartModel: ICartModel,
      private readonly apiClient: IApiClient,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) {
      this.addressView = new OrderAddressView(cloneTemplate<HTMLElement>('#order'), this.events);
      this.contactsView = new OrderContactsView(cloneTemplate<HTMLElement>('#contacts'), this.events);
      this.successView = new OrderSuccessView(cloneTemplate<HTMLElement>('#success'), this.events);
   }

   init(): void {
      this.events.on(AppEvent.ORDER_SUBMIT, () => this.openAddressStep());

      this.events.on(
         AppEvent.ORDER_FIELD_CHANGE,
         (e: { field: keyof OrderFormData; value: OrderFormData[keyof OrderFormData] }) => {
            this.orderModel.setField(e.field, e.value);
         }
      );

      this.events.on(AppEvent.ORDER_CHANGED, () => {
         this.syncViews();
      });

      this.events.on(AppEvent.ORDER_ADDRESS_SUBMIT, () => {
         const errors = this.orderModel.validate();
         if (errors.payment || errors.address) {
            this.syncViews();
            return;
         }

         this.openContactsStep();
      });

      this.events.on(AppEvent.ORDER_CONTACTS_SUBMIT, () => {
         const errors = this.orderModel.validate();
         if (errors.email || errors.phone) {
            this.syncViews();
            return;
         }

         void this.pay();
      });

      this.events.on(AppEvent.ORDER_SUCCESS_CLOSE, () => {
         this.modal.close();
         this.orderModel.clear();
      });

      this.syncViews();
   }

   private syncViews(): void {
      const data = this.orderModel.getData();
      const errors = this.orderModel.validate();

      this.addressView.render({
         payment: data.payment,
         address: data.address,
         errors: getAddressErrors(errors),
         valid: !errors.payment && !errors.address,
      });

      this.contactsView.render({
         email: data.email,
         phone: data.phone,
         errors: getContactsErrors(errors),
         valid: !errors.email && !errors.phone,
      });
   }

   private openAddressStep(): void {
      this.syncViews();
      this.modal.setContent(this.addressView.render());
      this.modal.open();
   }

   private openContactsStep(): void {
      this.syncViews();
      this.modal.setContent(this.contactsView.render());
      this.modal.open();
   }

   private async pay(): Promise<void> {
      const orderData = this.orderModel.getData();
      const items = [...this.cartModel.getItems()];
      if (items.length === 0 || !orderData.payment) return;

      const req: ApiOrderRequest = {
         items: items.map((item) => item.id),
         total: this.cartModel.getTotalPrice(),
         payment: orderData.payment,
         address: orderData.address,
         email: orderData.email,
         phone: orderData.phone,
      };

      const res = await this.apiClient.createOrder(req);

      this.successView.setTotal(res.total);
      this.modal.setContent(this.successView.render());
      this.modal.open();

      this.cartModel.clear();
      this.orderModel.clear();
   }
}
import { EventEmitter } from '../components/base/Events';
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

function formatAddressErrors(errors: OrderValidationErrors): string {
   return [errors.payment, errors.address].filter(Boolean).join('. ');
}

function formatContactsErrors(errors: OrderValidationErrors): string {
   return [errors.email, errors.phone].filter(Boolean).join('. ');
}

export class OrderPresenter {
   constructor(
      private readonly orderModel: IOrderModel,
      private readonly cartModel: ICartModel,
      private readonly apiClient: IApiClient,
      private readonly addressView: OrderAddressView,
      private readonly contactsView: OrderContactsView,
      private readonly successView: OrderSuccessView,
      private readonly modal: Modal,
      private readonly events: EventEmitter
   ) { }

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
         this.openContactsStep();
      });

      this.events.on(AppEvent.ORDER_CONTACTS_SUBMIT, () => {
         void this.pay();
      });

      this.events.on(AppEvent.ORDER_SUCCESS_CLOSE, () => {
         this.modal.close();
         this.orderModel.clear();
      });

      this.orderModel.clear();
   }

   private syncViews(): void {
      const data = this.orderModel.getData();
      const errors = this.orderModel.validate();

      this.addressView.render({
         payment: data.payment,
         address: data.address,
         errors: formatAddressErrors(errors),
         valid: !errors.payment && !errors.address,
      });

      this.contactsView.render({
         email: data.email,
         phone: data.phone,
         errors: formatContactsErrors(errors),
         valid: !errors.email && !errors.phone,
      });
   }

   private openAddressStep(): void {
      this.modal.setContent(this.addressView.render());
      this.modal.open();
   }

   private openContactsStep(): void {
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

      try {
         const res = await this.apiClient.createOrder(req);

         this.successView.setTotal(res.total);
         this.modal.setContent(this.successView.render());
         this.modal.open();

         this.cartModel.clear();
         this.orderModel.clear();
      } catch (error) {
         console.error(error);
      }
   }
}
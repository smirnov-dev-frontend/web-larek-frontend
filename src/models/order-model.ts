import type { EventEmitter } from '../components/base/Events';
import type { IOrderModel, OrderFormData, OrderValidationErrors } from '../types';
import { AppEvent } from '../types';

export class OrderModel implements IOrderModel {
   private data: OrderFormData = {
      payment: null,
      address: '',
      email: '',
      phone: '',
   };

   constructor(private readonly events: EventEmitter) { }

   setField<K extends keyof OrderFormData>(field: K, value: OrderFormData[K]): void {
      this.data = {
         ...this.data,
         [field]: value,
      };

      this.events.emit(AppEvent.ORDER_CHANGED, {});
   }

   getData(): OrderFormData {
      return { ...this.data };
   }

   validate(): OrderValidationErrors {
      const errors: OrderValidationErrors = {};

      if (!this.data.payment) {
         errors.payment = 'Выберите способ оплаты';
      }

      if (!this.data.address.trim()) {
         errors.address = 'Введите адрес доставки';
      }

      if (!this.data.email.trim()) {
         errors.email = 'Введите Email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.data.email)) {
         errors.email = 'Введите корректный Email';
      }

      const digits = this.data.phone.replace(/\D/g, '');
      if (!this.data.phone.trim()) {
         errors.phone = 'Введите телефон';
      } else if (digits.length < 10) {
         errors.phone = 'Телефон должен содержать минимум 10 цифр';
      }

      return errors;
   }

   clear(): void {
      this.data = {
         payment: null,
         address: '',
         email: '',
         phone: '',
      };

      this.events.emit(AppEvent.ORDER_CHANGED, {});
   }
}
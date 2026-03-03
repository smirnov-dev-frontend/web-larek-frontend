import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from '../components/base/Events';
import { AppEvent } from '../types';

export class Modal extends Component<HTMLElement> {
   private readonly closeButton: HTMLButtonElement;
   private readonly content: HTMLElement;

   private handleOverlayClickBound = (e: MouseEvent) => this.handleOverlayClick(e);
   private handleCloseBound = () => this.close();

   constructor(container: HTMLElement, private readonly events?: EventEmitter) {
      super(container);

      this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
      this.content = ensureElement<HTMLElement>('.modal__content', container);

      this.closeButton.addEventListener('click', this.handleCloseBound);
      this.container.addEventListener('click', this.handleOverlayClickBound);
   }

   setContent(node: HTMLElement | string): void {
      if (typeof node === 'string') {
         this.content.innerHTML = node;
      } else {
         this.content.replaceChildren(node);
      }
   }

   open(): void {
      this.container.classList.add('modal_active');
      this.events?.emit(AppEvent.MODAL_OPEN, {});
   }

   close(): void {
      this.container.classList.remove('modal_active');
      this.setContent('');
      this.events?.emit(AppEvent.MODAL_CLOSE, {});
   }

   private handleOverlayClick(e: MouseEvent): void {
      if (e.target === this.container) {
         this.close();
      }
   }
}
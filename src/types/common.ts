export interface IView<T> {
   render(data?: Partial<T>): HTMLElement;
}

export interface IModal {
   open(): void;
   close(): void;
}

export interface IDisposable {
   destroy(): void;
}
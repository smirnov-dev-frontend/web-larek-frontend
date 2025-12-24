export interface IView<T> {
   render(data: T): void;
}

export interface IModal {
   open(): void;
   close(): void;
}

export interface IDisposable {
   destroy(): void;
}
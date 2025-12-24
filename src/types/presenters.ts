export interface IPresenter {
   init(): void;
   destroy(): void;
}

export interface ICatalogPresenter extends IPresenter {
   selectProduct(productId: string): void;
}

export interface ICartPresenter extends IPresenter { }

export interface IOrderPresenter extends IPresenter {
   submitOrder(): void;
}
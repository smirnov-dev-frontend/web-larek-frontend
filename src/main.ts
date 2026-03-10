import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';
import { cloneTemplate, formatPrice } from './utils/utils';

import { LarekApiClient } from './services/larek-api-client';
import { ProductModel } from './models/product-model';
import { CartModel } from './models/cart-model';
import { OrderModel } from './models/order-model';

import { Modal } from './views/modal';
import { ProductListView } from './views/product-list';
import { HeaderBasketView } from './views/header-basket';
import { BasketView } from './views/basket';
import { BasketItemView } from './views/basket-item';
import { ProductCardView } from './views/product-card';
import { ProductPreviewView } from './views/product-preview';
import { OrderAddressView } from './views/order-address';
import { OrderContactsView } from './views/order-contacts';
import { OrderSuccessView } from './views/order-success';

import { CatalogPresenter } from './presenters/catalog-presenter';
import { CartPresenter } from './presenters/cart-presenter';
import { OrderPresenter } from './presenters/order-presenter';

import type { ApiProduct } from './types';

function mustGetElement<T extends HTMLElement>(selector: string): T {
   const el = document.querySelector(selector);
   if (!el) throw new Error(`Element not found: ${selector}`);
   return el as T;
}

const events = new EventEmitter();
const api = new Api(API_URL);
const apiClient = new LarekApiClient(api);

const gallery = mustGetElement<HTMLElement>('.gallery');
const modalRoot = mustGetElement<HTMLElement>('#modal-container');
const pageRoot = document.body;

const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

const productListView = new ProductListView(gallery);
const modal = new Modal(modalRoot, events);
const headerBasket = new HeaderBasketView(pageRoot, events);

const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const productPreviewView = new ProductPreviewView(cloneTemplate<HTMLElement>('#card-preview'), events);
const orderAddressView = new OrderAddressView(cloneTemplate<HTMLElement>('#order'), events);
const orderContactsView = new OrderContactsView(cloneTemplate<HTMLElement>('#contacts'), events);
const orderSuccessView = new OrderSuccessView(cloneTemplate<HTMLElement>('#success'), events);

let catalogPresenter: CatalogPresenter;

const createCatalogCard = (product: ApiProduct): HTMLElement => {
   const node = cloneTemplate<HTMLButtonElement>('#card-catalog');
   const card = new ProductCardView(node, {
      onClick: () => {
         catalogPresenter.selectProduct(product);
      },
   });

   const cardWithMedia = card as ProductCardView & { category: string; image: string };
   cardWithMedia.category = product.category;
   cardWithMedia.image = product.image;

   card.render({
      title: product.title,
      price: formatPrice(product.price),
      isInCart: cartModel.hasProduct(product.id),
   });

   return node;
};

const createBasketItem = (product: ApiProduct, index: number): HTMLElement => {
   const node = cloneTemplate<HTMLElement>('#card-basket');
   const item = new BasketItemView(node, {
      onDelete: () => {
         cartModel.removeProduct(product.id);
      },
   });

   item.render({
      index,
      title: product.title,
      priceText: formatPrice(product.price),
   });

   return node;
};

new CartPresenter(
   cartModel,
   productModel,
   headerBasket,
   basketView,
   createBasketItem,
   modal,
   events
).init();

catalogPresenter = new CatalogPresenter(
   apiClient,
   productModel,
   cartModel,
   productListView,
   productPreviewView,
   createCatalogCard,
   modal,
   events
);
catalogPresenter.init();

new OrderPresenter(
   orderModel,
   cartModel,
   apiClient,
   orderAddressView,
   orderContactsView,
   orderSuccessView,
   modal,
   events
).init();
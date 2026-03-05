import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';

import { LarekApiClient } from './services/larek-api-client';
import { ProductModel } from './models/product-model';
import { CartModel } from './models/cart-model';
import { OrderModel } from './models/order-model';

import { Modal } from './views/modal';
import { ProductListView } from './views/product-list';
import { HeaderBasketView } from './views/header-basket';

import { CatalogPresenter } from './presenters/catalog-presenter';
import { CartPresenter } from './presenters/cart-presenter';
import { OrderPresenter } from './presenters/order-presenter';

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

const productModel = new ProductModel(apiClient);
const cartModel = new CartModel();
const orderModel = new OrderModel(apiClient);

const productListView = new ProductListView(gallery);
const modal = new Modal(modalRoot, events);
const headerBasket = new HeaderBasketView(pageRoot, events);

new CartPresenter(cartModel, productModel, headerBasket, modal, events).init();

new CatalogPresenter(productModel, productListView, modal, events).init();

new OrderPresenter(orderModel, cartModel, productModel, modal, events).init();
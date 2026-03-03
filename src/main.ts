import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL } from './utils/constants';

import { LarekApiClient } from './services/larek-api-client';
import { ProductModel } from './models/product-model';
import { CartModel } from './models/cart-model';

import { Modal } from './views/modal';
import { ProductListView } from './views/product-list';
import { CatalogPresenter } from './presenters/catalog-presenter';

import { HeaderBasketView } from './views/header-basket';
import { CartPresenter } from './presenters/cart-presenter';

import { OrderModel } from './models/order-model';
import { OrderPresenter } from './presenters/order-presenter';

const events = new EventEmitter();
const api = new Api(API_URL);
const apiClient = new LarekApiClient(api);

const gallery = document.querySelector('.gallery') as HTMLElement;
const modalRoot = document.querySelector('#modal-container') as HTMLElement;
const pageRoot = document.body;

const productModel = new ProductModel(apiClient);
const cartModel = new CartModel();

const productListView = new ProductListView(gallery);
const modal = new Modal(modalRoot, events);

const headerBasket = new HeaderBasketView(pageRoot, events);

const cartPresenter = new CartPresenter(cartModel, productModel, headerBasket, modal, events);
cartPresenter.init();

const catalog = new CatalogPresenter(productModel, cartModel, productListView, modal, events);
catalog.init();

const orderModel = new OrderModel(apiClient);
const orderPresenter = new OrderPresenter(orderModel, cartModel, modal, events);
orderPresenter.init();

# Web-ларёк

Ссылка на GitHub Pages: https://smirnov-dev-frontend.github.io/web-larek-frontend/

## Описание проекта

Web-ларёк - веб-приложение интернет-магазина с товарами для веб-разработчиков.  
Приложение позволяет просматривать каталог товаров, добавлять товары в корзину и оформлять заказ в два шага.

Цель проекта - спроектировать и реализовать архитектуру веб-приложения на TypeScript с использованием ООП и документировать архитектурные решения.

Архитектура реализована по паттерну **MVP (Model–View–Presenter)**. Взаимодействие между слоями организовано через **брокер событий (EventEmitter)**, что обеспечивает слабую связанность компонентов.

---

## Используемый стек

* HTML
* SCSS
* TypeScript
* Vite
* Архитектурный паттерн: MVP (Model–View–Presenter)
* Брокер событий: EventEmitter
* REST API

---

## Установка и запуск проекта

1. Клонировать репозиторий:

```bash
git clone https://github.com/smirnov-dev-frontend/web-larek-frontend.git
```

Установить зависимости:

```
npm install
```

В корне проекта создать файл .env и добавить в него:

```
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Запустить проект:

```
npm run start
```

Собрать проект:

```
npm run build
```

---

# Архитектура приложения

## Общий подход

Проект разделён на слои:

Model - состояние и бизнес-логика приложения.

View - отображение и работа с DOM.

Presenter - сценарии пользовательского взаимодействия и связывание моделей с представлениями.

Infrastructure - базовые классы, клиент API, константы и утилиты.

Взаимодействие между слоями построено через брокер событий EventEmitter.
Модели хранят и изменяют данные, представления отвечают только за DOM, презентеры подписываются на события и координируют работу приложения.

---

# Infrastructure

## EventEmitter (src/components/base/Events.ts)

Класс EventEmitter реализует брокер событий приложения.

Назначение

- централизует обмен событиями между слоями приложения;
- позволяет избежать прямых зависимостей между классами;
- реализует паттерн Publisher–Subscriber.

Поля

events: Map<EventName, Set<Subscriber>> - хранилище подписчиков по именам событий.

Методы

- on(eventName, callback) - подписка на событие;
- off(eventName, callback) - отписка от события;
- emit(eventName, payload?) - генерация события;
- trigger(eventName, context?) - создание функции-триггера;
- onAll(callback) - подписка на все события;
- offAll() - очистка всех подписчиков.

---

## Api (src/components/base/Api.ts)

Базовый HTTP-класс для работы с сервером.

Назначение

- выполняет GET и POST запросы;
- централизует обработку ответов и ошибок;
- является низкоуровневой обёрткой над fetch.

Поля

baseUrl: string - базовый адрес API;

options: RequestInit - базовые параметры запросов.

Методы

get<T>(uri: string): Promise<T> - выполнение GET-запроса;

post<T>(uri: string, data: unknown, method?) - выполнение POST/PUT/DELETE-запроса;

handleResponse<T>(response: Response): Promise<T> - обработка ответа сервера.

---

## Component (src/components/base/Component.ts)

Базовый класс представлений.

Назначение

- задаёт общий интерфейс рендера UI-компонентов;
- позволяет переиспользовать общую логику отображения;
- служит базой для представлений каталога, корзины, заказа и модальных окон.

Поля

container: HTMLElement - корневой DOM-элемент компонента.

Методы

render(data?: Partial<T>): HTMLElement - рендер данных в DOM;

setImage(element, src, alt?) - установка изображения.

---

## LarekApiClient (src/services/larek-api-client.ts)

Класс прикладного API-клиента.

Назначение

- работает с конкретными методами API проекта;
- получает каталог товаров;
- отправляет заказ на сервер.

Поля

api: Api - экземпляр базового API-класса.

Методы

getProducts(): Promise<ApiProduct[]>

createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>

---

## Константы (src/utils/constants.ts)

В файле содержатся константы приложения:

API_URL - адрес API;

CDN_URL - адрес CDN для изображений;

categoryMap - карта соответствия категории и CSS-класса.

---

# Model

## ProductModel (src/models/product-model.ts)

Модель каталога товаров.

Назначение

- загружает список товаров с сервера;
- хранит каталог товаров;
- хранит текущий выбранный товар;
- предоставляет методы доступа к каталогу.

Поля

products: ApiProduct[] - список загруженных товаров;

selectedProductId: string | null - id выбранного товара;

apiClient: IApiClient - клиент API, передаваемый через конструктор модели.

Методы

loadProducts(): Promise<void> - загрузка каталога;

getProducts(): readonly ApiProduct[] - получить список товаров;

getProductById(id: string): ApiProduct | undefined - получить товар по id;

setSelectedProduct(productId: string): void - установить выбранный товар;

getSelectedProduct(): ApiProduct | undefined - получить выбранный товар;

clearSelectedProduct(): void - очистить выбранный товар.

---

## CartModel (src/models/cart-model.ts)

Модель корзины.

Назначение

- хранит товары, добавленные в корзину;
- управляет добавлением и удалением товаров;
- считает общую стоимость;
- считает количество товаров;
- оповещает приложение об изменении корзины.

Поля

items: ApiProduct[] - список товаров в корзине;

events: EventEmitter - используется для генерации событий интерфейса.

Методы

addProduct(product: ApiProduct): void - добавить товар в корзину;

removeProduct(productId: string): void - удалить товар из корзины;

hasProduct(productId: string): boolean - проверить наличие товара;

getItems(): readonly ApiProduct[] - получить список товаров;

getTotalPrice(): number - получить общую стоимость корзины;

getCount(): number - получить количество товаров;

clear(): void - очистить корзину.

При изменении корзины модель генерирует событие cart:changed.

---

## OrderModel (src/models/order-model.ts)

Модель данных заказа.

Назначение

- хранит состояние формы заказа;
- обновляет поля заказа;
- выполняет валидацию данных;
- предоставляет текущее состояние формы презентеру.

Поля

data: OrderFormData - данные формы заказа;

events: EventEmitter - брокер событий.

Поля data

payment: PaymentMethod | null - способ оплаты;

address: string - адрес доставки;

email: string - email пользователя;

phone: string - телефон пользователя.

Методы

setField(field, value): void - обновить поле формы;

getData(): OrderFormData - получить текущее состояние формы;

validate(): OrderValidationErrors - получить объект ошибок валидации;

clear(): void - очистить форму заказа.

При изменении данных модель генерирует событие order:changed.

---

# View

## Modal (src/views/modal.ts)

Класс модального окна.

Назначение

- показывает контент в модальном окне;
- закрывает модалку по клику на крестик и по клику на overlay;
- эмитит события открытия и закрытия.

Поля

closeButton: HTMLButtonElement - кнопка закрытия;

content: HTMLElement - контейнер содержимого;

events: EventEmitter - брокер событий.

Методы

setContent(node: HTMLElement | string): void - установить содержимое модалки;

open(): void - открыть модалку;

close(): void - закрыть модалку.

---

## ProductListView (src/views/product-list.ts)

Представление списка товаров.

Назначение

размещает готовые карточки товаров в контейнере каталога.

Поля

container: HTMLElement - контейнер списка товаров.

Методы

render(items: HTMLElement[]): HTMLElement - отрисовать список карточек.

---

## ProductCardView (src/views/product-card.ts)

Представление карточки товара в каталоге.

Назначение

- отображает краткую информацию о товаре;
- генерирует событие выбора товара.

Поля

id: string - идентификатор товара;

titleEl: HTMLElement - элемент названия;

priceEl: HTMLElement - элемент цены;

imageEl: HTMLImageElement - элемент изображения;

categoryEl: HTMLElement - элемент категории;

events: EventEmitter - брокер событий.

Методы

сеттер category - обновляет категорию;

сеттер image - обновляет изображение;

сеттер title - обновляет заголовок;

сеттер price - обновляет цену;

сеттер isInCart - обновляет состояние товара в корзине;

setSelected(selected: boolean): void - выделение карточки.

---

## ProductPreviewView (src/views/product-preview.ts)

Представление детальной карточки товара.

Назначение

- отображает полную информацию о товаре;
- позволяет добавить товар в корзину или удалить его из корзины.

Поля

id: string - идентификатор товара;

inCart: boolean - локальное UI-состояние кнопки;

titleEl, priceEl, imageEl, categoryEl, descEl, actionBtn - DOM-элементы карточки;

events: EventEmitter - брокер событий.

Методы

сеттеры title, description, priceText, image, category, isInCart;

fromProduct(product, isInCart) - создание объекта данных для рендера.

---

## BasketView (src/views/basket.ts)

Представление корзины.

Назначение

- отображает список товаров в корзине;
- отображает итоговую стоимость;
- управляет кнопкой оформления заказа.

Поля

list: HTMLElement - контейнер списка товаров;

totalEl: HTMLElement - элемент общей стоимости;

orderButton: HTMLButtonElement - кнопка оформления;

events: EventEmitter - брокер событий.

Методы

сеттер items - обновить список товаров;

сеттер total - обновить итоговую стоимость;

сеттер orderEnabled - включить или выключить кнопку заказа.

---

## BasketItemView (src/views/basket-item.ts)

Представление одного товара в корзине.

Назначение

- отображает товар в списке корзины;
- генерирует событие удаления товара.

Поля

_productId: string - id товара;

indexEl, titleEl, priceEl, deleteBtn - DOM-элементы;

events: EventEmitter - брокер событий.

Методы

сеттер index

сеттер title

сеттер priceText

сеттер productId

---

## HeaderBasketView (src/views/header-basket.ts)

Представление кнопки корзины в шапке.

Назначение

- отображает счётчик товаров;
- открывает корзину по клику.

Поля

button: HTMLButtonElement - кнопка корзины;

counter: HTMLElement - счётчик товаров;

events: EventEmitter - брокер событий.

Методы

setCount(count: number): void - обновить счётчик корзины.

---

## OrderAddressView (src/views/order-address.ts)

Представление первого шага заказа.

Назначение

- отображает форму ввода адреса;
- отображает выбор способа оплаты;
- генерирует события изменения полей формы;
- отображает ошибки и состояние кнопки отправки.

Поля

form: HTMLFormElement

addressInput: HTMLInputElement

errorEl: HTMLElement

submitBtn: HTMLButtonElement

payCardBtn: HTMLButtonElement

payCashBtn: HTMLButtonElement

events: EventEmitter

Методы

сеттер payment

сеттер address

сеттер errors

сеттер valid

---

## OrderContactsView (src/views/order-contacts.ts)

Представление второго шага заказа.

Назначение

- отображает форму ввода email и телефона;
- генерирует события изменения полей;
- отображает ошибки и состояние кнопки отправки.

Поля

form: HTMLFormElement

emailInput: HTMLInputElement

phoneInput: HTMLInputElement

errorEl: HTMLElement

submitBtn: HTMLButtonElement

events: EventEmitter

Методы

applyPhoneMask(value: string): string - форматирование телефона;

сеттер email

сеттер phone

сеттер errors

сеттер valid

---

## OrderSuccessView (src/views/order-success.ts)

Представление успешного оформления заказа.

Назначение

- отображает итоговую сумму успешного заказа;
- закрывает модальное окно по кнопке.

Поля

descEl: HTMLElement - описание успешного заказа;

closeBtn: HTMLButtonElement - кнопка закрытия;

events: EventEmitter

Методы

setTotal(total: number): void - установить сумму заказа.

---

# Presenter

## CatalogPresenter (src/presenters/catalog-presenter.ts)

Презентер каталога.

Назначение

- загружает каталог товаров из модели;
- рендерит карточки товаров;
- открывает подробное превью товара;
- обновляет каталог при изменении корзины.

Поля

productModel: IProductModel

cartModel: ICartModel

productListView: IProductListView

modal: Modal

events: EventEmitter

Методы

init(): void - регистрация обработчиков и первичная загрузка;

bootstrap(): Promise<void> - загрузка товаров;

renderCatalog(): void - рендер каталога;

createCardNode(product: ApiProduct): HTMLElement - создание карточки товара;

openPreview(): void - открытие превью выбранного товара.

---

## CartPresenter (src/presenters/cart-presenter.ts)

Презентер корзины.

Назначение

- реагирует на события добавления и удаления товаров;
- синхронизирует модель корзины и её отображение;
- открывает корзину в модальном окне;
- обновляет счётчик товаров в шапке.

Поля

basketView: BasketView

cartModel: ICartModel

productModel: IProductModel

headerBasket: HeaderBasketView

modal: Modal

events: EventEmitter

Методы

init(): void

updateView(): void

onAdd(productId: string): void

onRemove(productId: string): void

openCart(): void

createBasketItemNode(product: ApiProduct, index: number): HTMLElement

---

## OrderPresenter (src/presenters/order-presenter.ts)

Презентер оформления заказа.

Назначение

- координирует оба шага формы заказа;
- передаёт изменения полей в OrderModel;
- синхронизирует представления форм с состоянием модели;
- собирает данные заказа и отправляет их на сервер;
- очищает корзину и форму после успешного заказа.

Поля

addressView: OrderAddressView

contactsView: OrderContactsView

successView: OrderSuccessView

orderModel: IOrderModel

cartModel: ICartModel

apiClient: IApiClient

modal: Modal

events: EventEmitter

Методы

init(): void

syncViews(): void

openAddressStep(): void

openContactsStep(): void

pay(): Promise<void>

---

# Событийная модель

Основные события приложения:

product:selected - выбор товара

cart:open - открытие корзины

cart:add - добавление товара в корзину

cart:remove - удаление товара из корзины

cart:clear - очистка корзины

cart:changed - изменение корзины

order:submit - начало оформления заказа

order:field:change - изменение поля заказа

order:changed - изменение данных заказа

order:address:submit - подтверждение первого шага заказа

order:contacts:submit - подтверждение второго шага заказа

order:success:close - закрытие окна успешного заказа

modal:open - открытие модального окна

modal:close - закрытие модального окна

---

# Типы данных

Все типы и интерфейсы описаны в папке src/types.

Основные типы API

ApiProduct - товар, полученный с сервера;

ApiOrderRequest - тело запроса на создание заказа;

ApiOrderResponse - ответ сервера при успешном заказе;

PaymentMethod - способ оплаты (card | cash).

Контракты моделей

IProductModel

ICartModel

IOrderModel

Контракты представлений

IView<T>

IProductCardView

IProductListView

ICartView

IOrderAddressView

IOrderContactsView

IOrderSuccessView

IModalView

Прочие типы

OrderFormData

OrderValidationErrors

BasketViewData

OrderAddressViewData

OrderContactsViewData

Типизация используется во всех слоях приложения и обеспечивает согласованность архитектуры.


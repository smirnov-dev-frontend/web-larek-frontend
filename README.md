
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

Проект реализован по паттерну **MVP (Model–View–Presenter)**.

Архитектура разделена на четыре уровня:

- **Model** — хранение состояния приложения и работа с данными;
- **View** — отображение интерфейса и работа с DOM;
- **Presenter** — координация сценариев приложения, связывание моделей и представлений;
- **Infrastructure** — базовые классы, API-клиент, брокер событий, константы и утилиты.

Взаимодействие между слоями построено через брокер событий `EventEmitter`.  
Модели хранят и изменяют данные, представления только отображают текущее состояние интерфейса и генерируют пользовательские события, а презентеры подписываются на эти события и управляют сценарием работы приложения.

Особенности текущей архитектуры проекта:

- запросы к серверу выполняются в слое `Presenter`, а не в моделях;
- модели не зависят от API-клиента и отвечают только за хранение и модификацию данных;
- представления не используются как источник данных и не хранят предметное состояние приложения;
- экземпляры основных классов создаются в `main.ts` и передаются через конструкторы, что уменьшает связанность модулей;
- повторяющаяся логика вынесена в базовые классы и утилиты.

---

# Infrastructure

## EventEmitter (`src/components/base/Events.ts`)

Класс `EventEmitter` реализует брокер событий приложения.

### Назначение

- централизует обмен событиями между слоями приложения;
- позволяет избежать прямых зависимостей между классами;
- реализует паттерн `Publisher–Subscriber`;
- используется как единый механизм уведомления об изменении данных и пользовательских действиях.

### Поля

`events: Map<EventName, Set<Subscriber>>` — хранилище подписчиков по именам событий.

### Методы

- `on(eventName, callback)` — подписка на событие;
- `off(eventName, callback)` — отписка от события;
- `emit(eventName, payload?)` — генерация события;
- `trigger(eventName, context?)` — создание функции-триггера;
- `onAll(callback)` — подписка на все события;
- `offAll()` — очистка всех подписчиков.

---

## Api (`src/components/base/Api.ts`)

Базовый HTTP-класс для работы с сервером.

### Назначение

- выполняет `GET` и `POST` запросы;
- централизует обработку ответов и ошибок;
- является низкоуровневой обёрткой над `fetch`;
- служит инфраструктурной основой для прикладного API-клиента.

### Поля

`baseUrl: string` — базовый адрес API.

`options: RequestInit` — базовые параметры запросов.

### Методы

- `get<T>(uri: string): Promise<T>` — выполнение `GET`-запроса;
- `post<T>(uri: string, data: unknown, method?)` — выполнение `POST/PUT/DELETE`-запроса;
- `handleResponse<T>(response: Response): Promise<T>` — обработка ответа сервера.

---

## Component (`src/components/base/Component.ts`)

Базовый класс представлений.

### Назначение

- задаёт единый механизм рендера данных в DOM;
- позволяет переиспользовать общую логику отображения;
- служит базой для конкретных UI-компонентов проекта.

### Поля

`container: HTMLElement` — корневой DOM-элемент компонента.

### Методы

- `render(data?: Partial<T>): HTMLElement` — применяет переданные данные к компоненту через сеттеры и возвращает корневой элемент;
- `setImage(element, src, alt?)` — вспомогательный метод для установки изображения.

---

## LarekApiClient (`src/services/larek-api-client.ts`)

Прикладной API-клиент проекта.

### Назначение

- работает с конкретными методами API проекта;
- получает каталог товаров;
- отправляет заказ на сервер.

### Поля

`api: Api` — экземпляр базового API-класса.

### Методы

- `getProducts(): Promise<ApiProduct[]>` — получить каталог товаров;
- `createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>` — отправить заказ.

---

## Константы (`src/utils/constants.ts`)

В файле содержатся константы приложения:

- `API_URL` — адрес API;
- `CDN_URL` — адрес CDN для изображений;
- `categoryMap` — карта соответствия категории и CSS-класса карточки.

---

## Утилиты (`src/utils/utils.ts`)

Файл содержит набор переиспользуемых вспомогательных функций.

### Назначение

- работа с DOM-элементами;
- клонирование шаблонов;
- форматирование данных для отображения;
- общие служебные операции.

### Ключевые функции

- `ensureElement()` — безопасный поиск DOM-элемента;
- `ensureAllElements()` — получение списка DOM-элементов;
- `cloneTemplate()` — клонирование содержимого `template`;
- `formatPrice(price)` — форматирование стоимости товара;
- `createElement()` — создание DOM-элемента программно.

---

# Model

## ProductModel (`src/models/product-model.ts`)

Модель каталога товаров.

### Назначение

- хранит каталог товаров;
- хранит текущий выбранный товар;
- предоставляет методы доступа к каталогу;
- уведомляет приложение об обновлении каталога.

### Поля

`products: ApiProduct[]` — список загруженных товаров.

`selectedProduct: ApiProduct | null` — текущий выбранный товар.

`events: EventEmitter` — брокер событий.

### Методы

- `setProducts(products: ApiProduct[]): void` — записывает список товаров в модель и генерирует событие `catalog:changed`;
- `getProducts(): readonly ApiProduct[]` — возвращает список товаров;
- `getProductById(id: string): ApiProduct | undefined` — возвращает товар по идентификатору;
- `setSelectedProduct(product: ApiProduct): void` — устанавливает выбранный товар;
- `getSelectedProduct(): ApiProduct | undefined` — возвращает выбранный товар;
- `clearSelectedProduct(): void` — очищает выбранный товар.

### События модели

При записи каталога модель генерирует событие `catalog:changed`.

---

## CartModel (`src/models/cart-model.ts`)

Модель корзины.

### Назначение

- хранит товары, добавленные в корзину;
- управляет добавлением и удалением товаров;
- рассчитывает общую стоимость корзины;
- рассчитывает количество товаров;
- уведомляет приложение об изменении корзины.

### Поля

`items: ApiProduct[]` — список товаров в корзине.

`events: EventEmitter` — брокер событий.

### Методы

- `addProduct(product: ApiProduct): void` — добавить товар в корзину;
- `removeProduct(productId: string): void` — удалить товар из корзины;
- `hasProduct(productId: string): boolean` — проверить наличие товара в корзине;
- `getItems(): readonly ApiProduct[]` — получить список товаров корзины;
- `getTotalPrice(): number` — получить итоговую стоимость;
- `getCount(): number` — получить количество товаров;
- `clear(): void` — очистить корзину.

### События модели

При изменении корзины модель генерирует событие `cart:changed`.

---

## OrderModel (`src/models/order-model.ts`)

Модель данных заказа.

### Назначение

- хранит состояние формы заказа;
- обновляет поля формы;
- выполняет валидацию данных;
- предоставляет текущее состояние формы презентеру.

### Поля

`data: OrderFormData` — данные формы заказа.

`events: EventEmitter` — брокер событий.

### Поля объекта `data`

- `payment: PaymentMethod | null` — выбранный способ оплаты;
- `address: string` — адрес доставки;
- `email: string` — email пользователя;
- `phone: string` — телефон пользователя.

### Методы

- `setField(field, value): void` — обновить одно поле формы;
- `getData(): OrderFormData` — получить текущее состояние формы;
- `validate(): OrderValidationErrors` — получить объект ошибок валидации;
- `clear(): void` — очистить форму заказа.

### События модели

При изменении данных заказа модель генерирует событие `order:changed`.

---

# View

## Modal (`src/views/modal.ts`)

Класс модального окна.

### Назначение

- показывает произвольный контент в модальном окне;
- закрывает окно по клику на крестик;
- закрывает окно по клику на overlay;
- генерирует события открытия и закрытия.

### Поля

`closeButton: HTMLButtonElement` — кнопка закрытия.

`content: HTMLElement` — контейнер содержимого модального окна.

`events: EventEmitter` — брокер событий.

### Методы

- `setContent(node: HTMLElement | string): void` — установить содержимое модального окна;
- `open(): void` — открыть модальное окно;
- `close(): void` — закрыть модальное окно.

---

## ProductListView (`src/views/product-list.ts`)

Представление списка товаров.

### Назначение

- размещает готовые карточки товаров в контейнере каталога;
- отвечает только за вставку разметки списка в DOM.

### Поля

`container: HTMLElement` — контейнер списка товаров.

### Методы и сеттеры

- `set items(items: HTMLElement[])` — обновляет разметку списка товаров;
- `render()` — возвращает корневой контейнер компонента.

---

## ProductCardView (`src/views/product-card.ts`)

Представление карточки товара в каталоге.

### Назначение

- отображает краткую информацию о товаре;
- показывает название, цену, изображение и категорию;
- реагирует на клик по карточке через callback, переданный извне.

### Поля

`titleEl: HTMLElement` — элемент названия товара.

`priceEl: HTMLElement` — элемент стоимости.

`imageEl: HTMLImageElement` — элемент изображения.

`categoryEl: HTMLElement` — элемент категории.

### Методы и сеттеры

- `set category(value)` — обновляет категорию и CSS-модификатор;
- `set image(value)` — обновляет изображение товара;
- `set title(value)` — обновляет название товара;
- `set price(value)` — обновляет стоимость;
- `set isInCart(value)` — обновляет визуальное состояние карточки, если товар в корзине;
- `setSelected(selected: boolean): void` — выделение карточки.

---

## ProductPreviewView (`src/views/product-preview.ts`)

Представление детальной карточки товара.

### Назначение

- отображает полную информацию о товаре в модальном окне;
- показывает состояние основной кнопки действия;
- не хранит состояние корзины и не хранит `id` товара;
- генерирует событие `preview:toggle` по клику на кнопку действия.

### Поля

`titleEl: HTMLElement` — заголовок товара.

`priceEl: HTMLElement` — стоимость товара.

`imageEl: HTMLImageElement` — изображение товара.

`categoryEl: HTMLElement` — категория товара.

`descEl: HTMLElement` — описание товара.

`actionBtn: HTMLButtonElement` — кнопка действия.

`events: EventEmitter` — брокер событий.

### Методы и сеттеры

- `set title(value)` — обновить заголовок;
- `set description(value)` — обновить описание;
- `set priceText(value)` — обновить текст цены;
- `set image(value)` — обновить изображение;
- `set category(value)` — обновить категорию;
- `set buttonText(value)` — обновить текст кнопки;
- `set buttonDisabled(value)` — включить или выключить кнопку;
- `fromProduct(product, buttonText, buttonDisabled)` — сформировать объект данных для рендера превью.

---

## BasketView (`src/views/basket.ts`)

Представление корзины.

### Назначение

- отображает список товаров корзины;
- отображает итоговую стоимость;
- управляет кнопкой перехода к оформлению заказа;
- генерирует событие оформления заказа по нажатию кнопки.

### Поля

`list: HTMLElement` — контейнер списка товаров.

`totalEl: HTMLElement` — элемент общей стоимости.

`orderButton: HTMLButtonElement` — кнопка оформления заказа.

`events: EventEmitter` — брокер событий.

### Методы и сеттеры

- `set items(items)` — обновить список товаров;
- `set total(value)` — обновить итоговую стоимость;
- `set orderEnabled(enabled)` — включить или выключить кнопку оформления.

---

## BasketItemView (`src/views/basket-item.ts`)

Представление одного товара в корзине.

### Назначение

- отображает товар в списке корзины;
- отображает индекс, название и цену;
- вызывает callback удаления, переданный при создании.

### Поля

`indexEl: HTMLElement` — элемент индекса товара в корзине.

`titleEl: HTMLElement` — элемент названия товара.

`priceEl: HTMLElement` — элемент стоимости.

`deleteBtn: HTMLButtonElement` — кнопка удаления.

### Методы и сеттеры

- `set index(value)` — обновить индекс;
- `set title(value)` — обновить название;
- `set priceText(value)` — обновить стоимость.

---

## HeaderBasketView (`src/views/header-basket.ts`)

Представление кнопки корзины в шапке.

### Назначение

- отображает счётчик товаров;
- открывает корзину по клику на кнопку.

### Поля

`button: HTMLButtonElement` — кнопка корзины.

`counter: HTMLElement` — элемент счётчика.

`events: EventEmitter` — брокер событий.

### Методы

- `setCount(count: number): void` — обновить значение счётчика.

---

## OrderAddressView (`src/views/order-address.ts`)

Представление первого шага оформления заказа.

### Назначение

- отображает форму выбора способа оплаты;
- отображает поле адреса доставки;
- генерирует события изменения полей формы;
- отображает ошибки и доступность кнопки перехода на следующий шаг.

### Поля

`form: HTMLFormElement` — форма заказа.

`addressInput: HTMLInputElement` — поле адреса.

`errorEl: HTMLElement` — контейнер ошибок.

`submitBtn: HTMLButtonElement` — кнопка перехода к следующему шагу.

`payCardBtn: HTMLButtonElement` — кнопка оплаты картой.

`payCashBtn: HTMLButtonElement` — кнопка оплаты при получении.

`events: EventEmitter` — брокер событий.

### Методы и сеттеры

- `set payment(value)` — обновить выбранный способ оплаты;
- `set address(value)` — обновить поле адреса;
- `set errors(value)` — показать текст ошибки;
- `set valid(value)` — включить или выключить кнопку отправки.

---

## OrderContactsView (`src/views/order-contacts.ts`)

Представление второго шага оформления заказа.

### Назначение

- отображает форму ввода email и телефона;
- генерирует события изменения полей;
- отображает ошибки формы;
- управляет доступностью кнопки подтверждения заказа.

### Поля

`form: HTMLFormElement` — форма контактных данных.

`emailInput: HTMLInputElement` — поле email.

`phoneInput: HTMLInputElement` — поле телефона.

`errorEl: HTMLElement` — контейнер ошибок.

`submitBtn: HTMLButtonElement` — кнопка оплаты.

`events: EventEmitter` — брокер событий.

### Методы и сеттеры

- `applyPhoneMask(value: string): string` — вспомогательный метод форматирования телефона;
- `set email(value)` — обновить email;
- `set phone(value)` — обновить телефон с применением маски в сеттере;
- `set valid(value)` — включить или выключить кнопку отправки.

---

## OrderSuccessView (`src/views/order-success.ts`)

Представление успешного оформления заказа.

### Назначение

- отображает итоговую сумму успешного заказа;
- предоставляет кнопку закрытия окна успеха.

### Поля

`descEl: HTMLElement` — текстовый элемент описания результата заказа.

`closeBtn: HTMLButtonElement` — кнопка закрытия.

`events: EventEmitter` — брокер событий.

### Методы

- `setTotal(total: number): void` — установить итоговую сумму заказа.

---

# Presenter

## CatalogPresenter (`src/presenters/catalog-presenter.ts`)

Презентер каталога.

### Назначение

- получает каталог товаров через API-клиент;
- записывает каталог в `ProductModel`;
- рендерит список карточек товаров;
- открывает превью выбранного товара;
- синхронизирует превью и каталог при изменении корзины;
- обрабатывает действие кнопки в превью товара.

### Поля

`apiClient: IApiClient` — прикладной API-клиент.

`productModel: IProductModel` — модель каталога.

`cartModel: ICartModel` — модель корзины.

`productListView: IProductListView` — представление списка товаров.

`productPreviewView: ProductPreviewView` — представление превью товара.

`createCatalogCard: (product: ApiProduct) => HTMLElement` — фабрика карточки каталога.

`modal: Modal` — модальное окно.

`events: EventEmitter` — брокер событий.

### Методы

- `init(): void` — регистрация обработчиков событий;
- `bootstrap(): Promise<void>` — загрузка товаров с сервера;
- `renderCatalog(): void` — рендер каталога товаров;
- `openPreview(): void` — открыть превью товара;
- `renderPreview(): void` — обновить содержимое превью;
- `togglePreviewProduct(): void` — добавить или удалить товар из корзины из превью;
- `selectProduct(product: ApiProduct): void` — установить выбранный товар и открыть превью.

---

## CartPresenter (`src/presenters/cart-presenter.ts`)

Презентер корзины.

### Назначение

- реагирует на события добавления и удаления товаров;
- синхронизирует модель корзины с представлением;
- обновляет счётчик корзины в шапке;
- открывает корзину в модальном окне.

### Поля

`cartModel: ICartModel` — модель корзины.

`productModel: IProductModel` — модель каталога.

`headerBasket: HeaderBasketView` — представление кнопки корзины в шапке.

`basketView: BasketView` — представление корзины.

`createBasketItem: (product: ApiProduct, index: number) => HTMLElement` — фабрика элемента корзины.

`modal: Modal` — модальное окно.

`events: EventEmitter` — брокер событий.

### Методы

- `init(): void` — регистрация обработчиков событий;
- `updateView(): void` — синхронизация корзины и интерфейса;
- `onAdd(productId: string): void` — добавить товар в корзину;
- `onRemove(productId: string): void` — удалить товар из корзины;
- `openCart(): void` — открыть модальное окно корзины.

---

## OrderPresenter (`src/presenters/order-presenter.ts`)

Презентер оформления заказа.

### Назначение

- координирует оба шага оформления заказа;
- передаёт изменения полей формы в `OrderModel`;
- синхронизирует состояние форм с состоянием модели;
- собирает данные заказа и отправляет их на сервер;
- показывает окно успешного оформления;
- очищает корзину и форму после завершения заказа.

### Поля

`orderModel: IOrderModel` — модель формы заказа.

`cartModel: ICartModel` — модель корзины.

`apiClient: IApiClient` — клиент API для отправки заказа.

`addressView: OrderAddressView` — представление первого шага заказа.

`contactsView: OrderContactsView` — представление второго шага заказа.

`successView: OrderSuccessView` — представление успешного оформления.

`modal: Modal` — модальное окно.

`events: EventEmitter` — брокер событий.

### Методы

- `init(): void` — регистрация обработчиков событий;
- `syncViews(): void` — синхронизация состояния форм с данными модели;
- `openAddressStep(): void` — открыть первый шаг оформления;
- `openContactsStep(): void` — открыть второй шаг оформления;
- `pay(): Promise<void>` — отправить заказ и показать экран успеха.

---

# Событийная модель

Основные события приложения:

- `catalog:changed` — каталог товаров обновлён в модели;
- `preview:toggle` — нажатие на кнопку действия в превью товара;
- `cart:open` — открытие корзины;
- `cart:add` — добавление товара в корзину;
- `cart:remove` — удаление товара из корзины;
- `cart:clear` — очистка корзины;
- `cart:changed` — состояние корзины изменено;
- `order:submit` — начало оформления заказа;
- `order:field:change` — изменение поля формы заказа;
- `order:changed` — данные заказа обновлены;
- `order:address:submit` — подтверждение первого шага заказа;
- `order:contacts:submit` — подтверждение второго шага заказа;
- `order:success:close` — закрытие окна успешного заказа;
- `modal:open` — открытие модального окна;
- `modal:close` — закрытие модального окна.

---

# Типы данных

Все типы и интерфейсы описаны в папке `src/types`.

## Основные типы API

- `ApiProduct` — товар, полученный с сервера;
- `ApiOrderRequest` — тело запроса на создание заказа;
- `ApiOrderResponse` — ответ сервера при успешном создании заказа;
- `PaymentMethod` — способ оплаты (`card | cash`).

## Контракты моделей

- `IProductModel`
- `ICartModel`
- `IOrderModel`

## Контракты представлений

- `IView<T>`
- `IProductCardView`
- `IProductListView`
- `ICartView`
- `IOrderAddressView`
- `IOrderContactsView`
- `IOrderSuccessView`
- `IModalView`

## Прочие типы

- `OrderFormData`
- `OrderValidationErrors`
- `BasketViewData`
- `OrderAddressViewData`
- `OrderContactsViewData`

Типизация используется во всех слоях приложения и обеспечивает согласованность архитектуры приложения.
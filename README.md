
# Web-ларёк

## Описание проекта

Web-ларёк — веб-приложение интернет-магазина с товарами для веб-разработчиков.
Приложение позволяет просматривать каталог товаров, добавлять товары в корзину и оформлять заказ в два шага.

Цель проекта — спроектировать и реализовать архитектуру веб-приложения на TypeScript с использованием ООП и документировать архитектурные решения.

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

2. Установить зависимости:

```bash
npm install
```

3. В корне проекта создать файл `.env` и добавить в него:

```bash
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

4. Запустить проект:

```bash
npm run start
```

5. Собрать проект:

```bash
npm run build
```

---

## Архитектура приложения

### Общий подход

Проект разделён на слои:

* **Model** — состояние и бизнес-логика (каталог, корзина, заказ).
* **View** — отображение и работа с DOM (компоненты интерфейса).
* **Presenter** — сценарии приложения и связывание Model/View.
* **Infrastructure** — API, клиент API, брокер событий, утилиты.

Взаимодействие между частями приложения построено через события, что исключает прямые зависимости между слоями.

---

## Infrastructure

### EventEmitter (`src/components/base/Events.ts`)

Брокер событий, реализующий паттерн Publisher–Subscriber.

**Назначение:**

* централизовать события приложения;
* обеспечить взаимодействие между слоями без прямых вызовов методов;
* поддержать события по строковому имени и RegExp-подписки.

**Основные методы:**

* `on(eventName, callback)` — подписка
* `off(eventName, callback)` — отписка
* `emit(eventName, payload?)` — генерация события
* `trigger(eventName, context?)` — создание функции-триггера
* `onAll(callback)` / `offAll()` — подписка на все события / очистка

---

### Api (`src/components/base/Api.ts`)

Базовый HTTP-клиент для выполнения запросов к серверу.

**Назначение:**

* единая точка выполнения HTTP-запросов;
* унифицированная обработка ошибок и JSON-ответов.

**Основные методы:**

* `get<T>(uri: string): Promise<T>`
* `post<T>(uri: string, data: unknown, method?: 'POST'|'PUT'|'DELETE'): Promise<T>`

---

### LarekApiClient (`src/services/larek-api-client.ts`)

Клиент прикладного API, реализует интерфейс `IApiClient`.

**Методы:**

* `getProducts(): Promise<ApiProduct[]>`
* `createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>`

---

### Константы (`src/utils/constants.ts`)

* `API_URL` — базовый URL API: `${VITE_API_ORIGIN}/api/weblarek`
* `CDN_URL` — базовый URL CDN: `${VITE_API_ORIGIN}/content/weblarek/`
* `categoryMap` — соответствие категории товара CSS-модификатору

---

## Model

### ProductModel (`src/models/product-model.ts`)

Модель каталога.

**Состояние:**

* `products: ApiProduct[]`

**Методы:**

* `loadProducts(): Promise<void>` — загрузка каталога
* `getProducts(): ApiProduct[]` — получить список
* `getProductById(id: string): ApiProduct | undefined` — получить товар по id

---

### CartModel (`src/models/cart-model.ts`)

Модель корзины. Хранит **только идентификаторы товаров**, а детали берутся из каталога через `ProductModel`.

**Состояние:**

* `items: string[]` (id товаров)

**Методы:**

* `addProduct(productId: string): void`
* `removeProduct(productId: string): void`
* `hasProduct(productId: string): boolean`
* `getItems(): string[]`
* `clear(): void`

---

### OrderModel (`src/models/order-model.ts`)

Модель заказа, отправляет данные заказа на сервер через `IApiClient`.

**Методы:**

* `createOrder(data: ApiOrderRequest): Promise<ApiOrderResponse>`

---

## View

### Component (`src/components/base/Component.ts`)

Базовый класс для UI-компонентов.

**Конструктор:**

* `constructor(container: HTMLElement)`

**Методы:**

* `render(data?: Partial<T>): HTMLElement`
* `setImage(element: HTMLImageElement | null, src: string, alt?: string): void`

---

### Modal (`src/views/modal.ts`)

Модальное окно с поддержкой закрытия:

* по клику на overlay;
* по клику на крестик.

**Методы:**

* `setContent(node: HTMLElement | string): void`
* `open(): void` (эмитит `modal:open`)
* `close(): void` (эмитит `modal:close`)

---

### Основные отображения

* `ProductCardView` — карточка товара в каталоге, эмитит `product:selected`
* `ProductListView` — размещает готовые DOM-элементы карточек в контейнер
* `ProductPreviewView` — превью товара в модалке, эмитит `cart:add` / `cart:remove`
* `BasketView` — отображение корзины (список, total, кнопка оформления)
* `BasketItemView` — элемент корзины (удаление товара → `cart:remove`)
* `HeaderBasketView` — кнопка корзины + счётчик, эмитит `cart:open`
* `OrderAddressView` — шаг 1 (оплата + адрес), эмитит `order:address:submit`
* `OrderContactsView` — шаг 2 (email + телефон), эмитит `order:contacts:submit`
* `OrderSuccessView` — экран успеха, эмитит `order:success:close`

---

## Presenter

### CatalogPresenter (`src/presenters/catalog-presenter.ts`)

Сценарий каталога:

* загружает товары через `ProductModel`;
* создаёт карточки и передаёт их в `ProductListView`;
* открывает превью товара в `Modal`;
* реагирует на события корзины, чтобы обновлять UI-состояние карточек/превью.

---

### CartPresenter (`src/presenters/cart-presenter.ts`)

Сценарий корзины:

* реагирует на `cart:open`, `cart:add`, `cart:remove`, `cart:clear`;
* строит список товаров корзины по `CartModel.getItems()` и данным из `ProductModel`;
* считает итоговую стоимость на стороне презентера;
* управляет счётчиком в `HeaderBasketView`;
* открывает корзину в `Modal`.

---

### OrderPresenter (`src/presenters/order-presenter.ts`)

Сценарий оформления заказа:

* `order:submit` → шаг 1 (оплата + адрес)
* `order:address:submit` → шаг 2 (контакты)
* `order:contacts:submit` → отправка заказа через `OrderModel`
* после успеха: показывает `OrderSuccessView`, очищает корзину и эмитит `cart:clear`

---

## Событийная модель (`src/types/events.ts`)

Основные события приложения:

* `product:selected`
* `cart:open`, `cart:add`, `cart:remove`, `cart:clear`
* `order:submit`
* `order:address:submit`
* `order:contacts:submit`
* `order:success:close`
* `modal:open`, `modal:close`

---

## Типы данных (`src/types/`)

Типы и интерфейсы описаны в `src/types/`:

* DTO API: `ApiProduct`, `ApiOrderRequest`, `ApiOrderResponse`, `PaymentMethod`
* Контракт API-клиента: `IApiClient`
* Контракты моделей: `IProductModel`, `ICartModel`, `IOrderModel`
* Контракты view/общие типы и события

Типизация используется во всех слоях, `any` не применяется.


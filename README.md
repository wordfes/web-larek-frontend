# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Основные типы данных

## interface IAppState

Интерфейс описывающий состояние приложения

- catalog: IProduct[] - каталог товаров
- basket: IProduct[] - корзина
- order: IOrder | null - заказ
- setCatalog(items: IProduct[]): void - устанавливаем каталог товаров
- addToBasket(product: IProduct): void - добавляем товар в корзину
- removeFromBasket(product: IProduct): void - удаляем товар из корзины
- getTotalBasketPrice(): number - метод возвращает общую стоимость товаров в корзине

## interface IModal

интерфейс описывающий содержимое модельного окна

- content: HTMLElement - DOM-элемент модального окна

## interface IProduct

интерфейс описывающий поля карточки товара

- id: string - идентификатор товара в магазине
- image: string - URL адрес картинки товара
- title: string - название товара
- category: string - категория товара
- price: number | null - цена товара
- description: string - описание товара
- selected: boolean - продукт выбран

## interface IPage

интерфейс описывающий страницу

- counter: number - счетчик товаров в корзине
- catalog: HTMLElement[] - массив карточек с товарами
- locked: boolean - блокировка прокрутки страницы

## interface IBasket

интерфейс описывающий корзину товаров

- list: HTMLElement[] - массив строк с товарами
- total: number - общая стоимость товаров

## interface IProductInBasket extends IProduct

Интерфейс описывает товар в списке корзины

- index: number - порядковый номер в корзине

## interface IOrder

интерфейс описывающий информацию о заказе

- items: string[] - массив идентификаторов купленных товаров
- payment: string - способ оплаты
- total: number - сумма заказа
- address: string - адрес доставки
- email: string - Email
- phone: string - номер телефона

## interface IContactsForm

Интерфейс описывает окно ввода контактных данных

- phone: string - телефон
- email: string - Email

## interface IOrderForm

Интерфейс описывающий форму оплаты

- address: string - адрес
- payment: string - способ оплаты

## interface IOrderResult

Интерфейс описывающий ответ успешной покупки

- id: string - идентификатор заказа
- total: number - сумма заказа

## interface IOrderValidate

Интерфейс используется для валидации полей при заполнении модели заказа

- phone: string;- телефон
- email: string; - Email
- address: string; - адрес
- payment: string; - способ оплаты

## interface ISuccessForm

Интерфейс описывает форму успешного заказа

- description: number; - сумма списанных средств
// Интерфейс осписывающий карточку товара магазина
export interface IProduct {
	// Идентификатор товара в магазине
	id: string;

	// URL адрес картинки товара
	image: string;

	// Название товара
	title: string;

	// Категория товара
	category: string;

	// Цена товара
	price: number | null;

	// Описание товара
	description: string;

	// Продукт выбран
	selected: boolean;
}

// Интерфейс описывающий страницу
export interface IPage {
	// Счетчик товаров в корзине
	counter: number;

	// Массив карточек с товарами
	catalog: HTMLElement[];

	// Блокировка прокрутки страницы
	locked: boolean;
}

// Интерфей описываюзий состояние приложения
export interface IAppState {
	// Каталог товаров
	catalog: IProduct[];

	// Корзина
	basket: IProduct[];

	// Заказ
	order: IOrder | null;

	// Устанавливаем каталог товаров
	setCatalog(items: IProduct[]): void;

	// Добавляем товар в корзину
	addToBasket(product: IProduct): void;

	// Удаляем товар из корзины
	removeFromBasket(product: IProduct): void;

	// Метод возвращает общую стоимость товаров в корзине
	getTotalBasketPrice(): number;
}

// Интерфейс описывающий информацию о заказе
export interface IOrder {
	// Массив идентификаторов купленных товаров
	items: string[];

	// Способ оплаты
	payment: string;

	// Сумма заказа
	total: number;

	// Адрес доставки
	address: string;

	// Email
	email: string;

	// Номер телефона
	phone: string;
}

// Интерфейс описывающий ответ успешной покупки
export interface IOrderResult {
	// Идентификатор заказа
	id: string;

	// Сумма заказа
	total: number;
}

// Интерфейс описывающий содержимое модельного окна
export interface IModal {
	content: HTMLElement;
}

// Интерфейс описывающий корзину товаров
export interface IBasket {
	// Массив строк с товарами
	list: HTMLElement[];

	// Общая цена товаров
	total: number;
}

// Интерфейс описывает товар в списке корзины
export interface IProductInBasket extends IProduct {
	// Порядковый номер в корзине
	index: number;
}

// Интерфейс описывает окно ввода контактных данных
export interface IContactsForm {
	// Телефон
	phone: string;

	// Email
	email: string;
}

// Интерфейс описывающий форму оплаты
export interface IOrderForm {
	// Адрес
	address: string;

	// Способ оплаты
	payment: string;
}

// Интерфейс используется для валидации полей при
// заполнении модели заказа
export interface IOrderValidate {
	// Телефон
	phone: string;

	// Email
	email: string;

	// Адрес
	address: string;

	// Способ оплаты
	payment: string;
}

// Интерфейс описывает форму успешного заказа
export interface ISuccessForm {
	// Количество списанных средств
	description: number;
}

// Тип, описывающий ошибки валидации форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;
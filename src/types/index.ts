// Интерфейс карточки товара
export interface IProduct {
	id: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	description: string;
	index: number;
	inBasket: boolean; // Товар в корзине
}

// Интерфейс страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean; // Блокировка прокрутки страницы
}

// Интерфейс состояния приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
}

// Интерфейс формы заказа
export interface IOrderForm {
	payment: string;
	address: string;
}
  
// Интерфейс формы ввода контактных данных
export interface IContactForm {
	email: string;
	phone: string;
}

// Интерфейс заказа
export interface IOrder extends IOrderForm, IContactForm {
	items: string[];
	total: number; // Сумма заказа
}

// Интерфейс валидации форм
export interface IOrderValidate {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

// Тип ошибок формы
export type IFormErrors = Partial<Record<keyof IOrder, string>>;
// Интерфейс осписывающий карточку товара магазина
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

// Интерфейс описывающий страницу
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean; // Блокировка прокрутки страницы
}

// Интерфей описываюзий состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
}
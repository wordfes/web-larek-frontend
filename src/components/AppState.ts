import { Model } from './base/Model';
import { IAppState, IProduct, IOrder, IOrderValidate, IFormErrors } from '../types/index';

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};
	formErrors: IFormErrors = {};
    
    // Установка каталога товаров
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	// Добавление товара в корзину
	addToBasket(item: IProduct) {
		this.basket.push(item);
	}

	// Удаление товара из корзины
	removeFromBasket(item: IProduct) {
		this.basket = this.basket.filter(basketItem => basketItem !== item);
	}

	// Проверка на наличие товара в корзине
	inBasket(id: string) {
		return !!this.basket.find((item) => item.id === id);
	}

	// Получение суммы товаров в корзине
	getTotalBasket() {
		let total: number = 0;
		this.basket.forEach((item) => {
			total = total + item.price;
		});
		return total;
	}
    
	// Получение количества товаров в корзине
	getCountBasket() {
		return this.basket.length;
	}

	// Запись данных из формы заказа
	setOrderFields(field: keyof IOrderValidate, value: string) {
		this.order[field] = value;

		if (!this.validateOrder()) {
			return;
		}

		if (!this.validateContact()) {
			return;
		}
	}
    
	// Валидация полей формы заказа
	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
    
	// Валидация полей формы контактов
	validateContact(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Очистка корзины
	clearBasket() {
		this.basket.forEach((item) => {
			item.inBasket = false;
		});
		this.basket = [];
	}

	// Очистка заказа
	clearOrder() {
		this.order.total = 0;
		this.order.items = [];
	}
}
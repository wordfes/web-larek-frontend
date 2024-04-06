import { Model } from './base/Model';
import { IAppState, IProduct } from '../types/index';

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];
    
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
}
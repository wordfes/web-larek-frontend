import {Api, ApiListResponse} from './base/api';
import {IProduct} from '../types';

interface IStoreAPI {
	getProduct: (id: string) => Promise<IProduct>;
	getProducts: () => Promise<IProduct[]>;
}

export class StoreAPI extends Api implements IStoreAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
    
	// Получение списка всех товаров
	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
    
	// Получение товара по id
	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}
}
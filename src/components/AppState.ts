import { Model } from './base/Model';
import { IAppState, IProduct } from '../types/index';

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	basket: IProduct[] = [];

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}
}
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderForm extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._card = container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this._card) {
			this._card.addEventListener('click', () => {
				this.addClass(this._card, 'button_alt-active');
				this.removeClass(this._cash, 'button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this.addClass(this._cash, 'button_alt-active');
				this.removeClass(this._card, 'button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = container.querySelector(`.${blockName}__list`);
		this._total = container.querySelector(`.${blockName}__price`);
		this._button = container.querySelector(`.${blockName}__button`);

		this.items = [];

		this._button.addEventListener('click', () =>
			this.events.emit('order:open')
		);
	}

	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

	set total(value: number) {
		this.setText(this._total, `${value} синапсов`);

		if (value === 0) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}
}
import { createElement } from '../utils/utils';
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
	}
}
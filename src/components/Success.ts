import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(protected blockName: string, container: HTMLElement, actions?: ISuccessActions) {
		super(container);

		this._button = container.querySelector(`.${blockName}__close`);
		this._description = container.querySelector(`.${blockName}__description`);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${value} синапсов`);
	}
}
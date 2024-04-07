import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';

import { AppState } from './components/AppState';
import { StoreAPI } from './components/StoreAPI';
import { Card } from './components/Card';
import { IProduct, IOrderForm, IContactForm, IOrderValidate, IOrder } from './types';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm('order', cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsFormTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {onClick: () => modal.close()});

// Получаем товары с сервера
api
	.getProducts()
	.then(appData.setCatalog.bind(appData))
	.catch(err => {
        console.error(err);
    });

// Изменились элементы каталога
events.on('catalog:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открытие попапа с товаром
events.on('card:select', (item: IProduct) => {
	const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (item.inBasket) {
				events.emit('basket:remove', item);
			} else {
				events.emit('basket:add', item);
			}
			card.updateButton(item.inBasket);
			modal.close();
		},
	});

	return modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			description: item.description,
			inBasket: item.inBasket,
		}),
	});
});

// Добавление товара в корзину
events.on('basket:add', (item: IProduct) => {
	appData.addToBasket(item);
	item.inBasket = true;
	basket.total = appData.getTotalBasket();
	page.counter = appData.getCountBasket();
});

// Удаление товара из корзины
events.on('basket:remove', (item: IProduct) => {
	appData.removeFromBasket(item);
	item.inBasket = false;
	basket.total = appData.getTotalBasket();
	page.counter = appData.getCountBasket();
	basket.items = appData.basket.map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	return modal.render({
		content: basket.render({
			total: appData.getTotalBasket(),
		}),
	});
});

// Открытие попапа корзины
events.on('basket:open', () => {
	basket.items = appData.basket.map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:remove', item);
			},
		});

		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	return modal.render({
		content: basket.render({
			total: appData.getTotalBasket(),
		}),
	});
});

// Открытие попапа с формой заказа
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось поле заказа или контактов
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderValidate; value: string }) => {
		appData.setOrderFields(data.field, data.value);
	}
);

// Валидация формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({payment, address}).filter((i) => !!i).join('; ');
});

// Открытие попапа с формой контактов
events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasket();
	appData.order.items = appData.basket.map((item) => item.id);

	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
		}),
	});
});

// Валидация формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({phone, email}).filter((i) => !!i).join('; ');
});

// Открытие попапа успешной оплаты и отправка данных заказа
events.on('contacts:submit', () => {
	api
		.sendOrder(appData.order)
		.then(() => {
			modal.render({
				content: success.render({
					total: appData.getTotalBasket(),
				}),
			});

			appData.clearBasket();
			appData.clearOrder();
			page.counter = 0;
		})
		.catch(err => {
			console.error(err);
		});
});

// Блокируем прокрутку при открытии попапа
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку при закрытии попапа
events.on('modal:close', () => {
    page.locked = false;
});
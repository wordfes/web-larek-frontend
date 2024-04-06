import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';

import { AppState } from './components/AppState';
import { StoreAPI } from './components/StoreAPI';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { IProduct } from './types';
import { Basket } from './components/Basket';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

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
			id: item.id,
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
		},
	});

	return modal.render({
		content: card.render({
			id: item.id,
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
	const basketItems = appData.basket.map((item, index) => {
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
			items: basketItems,
			total: appData.getTotalBasket(),
		}),
	});
});

// Открытие попапа корзины
events.on('basket:open', () => {
	const basketItems = appData.basket.map((item, index) => {
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
			items: basketItems,
			total: appData.getTotalBasket(),
		}),
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
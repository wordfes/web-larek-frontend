import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';

import { AppState } from './components/AppState';
import { StoreAPI } from './components/StoreAPI';
import { Card } from './components/Card';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

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
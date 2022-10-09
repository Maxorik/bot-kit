const DB_MAIN = require('../db_core/databaseMainController');
const DB_ORDERS = require('../orders/databaseOrdersController');
const { ordersInit } = require('../orders/ordersController')

let rowPos = 0;             // позиция дб для каталога
let database = [];          // массив для полученной БД

// инлайновая клавиатура для каталога
const keyboardCatalog = {
    inline_keyboard: [
        [{
            text: 'Назад',
            callback_data: 'getBack'
        }, {
            text: 'Купить',
            callback_data: 'buyItem'
        }, {
            text: 'Вперед',
            callback_data: 'getForward'
        }]
    ]
};

// инлайновая клавиатура для добавленного товара
const keyboardOrder = {
    inline_keyboard: [
        [{
            text: 'В корзину',
            callback_data: 'goToOrders'
        }, {
            text: 'Отменить',
            callback_data: 'rollbackOrder'
        }]
    ]
};

// возвращает новую запись из бд в бота
function getEntry(bot, payload) {
    const imgUrl = `${database[rowPos].photo}`;
    const messageTemplate = `<b>${database[rowPos].name}</b> \n <a href="${imgUrl}">&#8205;</a> \n ${database[rowPos].description} \n\n <i>Цена: ${database[rowPos].price}</i>`;
    try {
        bot.editMessageText(
            messageTemplate,
            {
                chat_id: payload.message.chat.id,
                message_id: payload.message.message_id,
                reply_markup: JSON.stringify(keyboardCatalog),
                parse_mode: 'HTML'
            }
        );
    } catch (err) {
        console.log(err);
    }
}

// следующая позиция из бд
function getNextItem(bot, payload) {
    if(rowPos < database.length) {
        (rowPos < database.length-1) && rowPos++;
        getEntry(bot, payload);
    }
}

// предыдущая позиция из бд
function getPreviousItem(bot, payload) {
    if(rowPos !== 0) {
        rowPos > 0 && rowPos--;
        getEntry(bot, payload);
    }
}

// добавить в корзину
function addItemToCart(bot, chatId) {
    const orderParams = {
        "order_id": Date.now().toString(),
        "state":    "in_progress",                  // TODO продумать названия этапов цикла жизни заказа
        "product":  database[rowPos].product_id,
        "user":     chatId,
        "price":    database[rowPos].price,
        "name":     database[rowPos].name,
        "count":    1                               // TODO если позиция уже есть, не добавлять заказ, а инкрементировать count
    };

    const successText = `В корзину было добавлено: ${database[rowPos].name}.\n\nВы можете перейти <b>в корзину</b> для оформления заказа, <b>отменить</b> этот заказ, либо продолжить просматривать каталог и добавить что-то еще. `;

    // проверяем, был ли уже заказан этот-же товар
    new Promise((resolve, reject) => {
        DB_MAIN.getEntryParamList(resolve, reject, 'products', );
    }).then( (res) => {

    })

    DB_ORDERS.addNewOrder(orderParams, 'orders');

    bot.sendMessage(chatId, successText, {
        reply_markup: JSON.stringify(keyboardOrder),
        parse_mode: 'HTML'
    });

    bot.on('callback_query', (query) => {
        switch (query.data) {
            case 'goToOrders':
                ordersInit(bot, chatId);
                break;
            case 'rollbackOrder':
                addItemToCart(bot, chatId);
                break;
        }
    });
}

module.exports = {
    // вызов клавиатуры, обновление БД, сброс переменной-позиции каталога
    catalogInit: function (bot, chatId) {
        rowPos = 0;
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryList(resolve, reject, 'products');
        }).then( (res) => {
            database = res;

            bot.on('callback_query', (query) => {
                const chatId = query.message.chat.id;
                switch (query.data) {
                    case 'getBack':
                        getPreviousItem(bot, query);
                        break;
                    case 'buyItem':
                        addItemToCart(bot, chatId);
                        break;
                    case 'getForward':
                        getNextItem(bot, query);
                        break;
                }
            });

            const messageTemplate = `<b>${database[rowPos].name}</b> \n <a href="${database[rowPos].photo}">&#8205;</a> \n ${database[rowPos].description} \n\n <i>Цена: ${database[rowPos].price}</i>`;
            bot.sendMessage(chatId, messageTemplate, {
                reply_markup: JSON.stringify(keyboardCatalog),
                parse_mode: 'HTML'
            })
        });
    }
}
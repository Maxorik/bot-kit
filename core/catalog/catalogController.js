const DB_MAIN = require('../db_core/databaseMainController');
const DB_CATALOG = require('./databaseCatalogController');

let rowPos = 0;            // позиция дб для каталога
let database = [];          // массив для полученной БД

// инлайновая клавиатура для каталога
const keyboardCatalog = {
    inline_keyboard: [
        [{
            text: 'Back',
            callback_data: 'getBack'
        }, {
            text: 'Buy',
            callback_data: 'buyItem'
        }, {
            text: 'Forward',
            callback_data: 'getForward'
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
    DB_CATALOG.addNewOrder('orders', database[rowPos].product_id);

    // bot.editMessageText(payload.message.chat.id,'добавлено в корзину кек но будет подругому');
}

module.exports = {
    // колбэки кнопок
    catalogCallbacks: function(bot, query) {
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
    },

    // событие при вызове клавиатуры: обновление БД, сброс переменной-позиции каталога
    catalogInit: function (bot, chatId) {
        rowPos = 0;
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryList(resolve, reject, 'products');
        }).then( (res) => {
            database = res;
            const messageTemplate = `<b>${database[rowPos].name}</b> \n <a href="${database[rowPos].photo}">&#8205;</a> \n ${database[rowPos].description} \n\n <i>Цена: ${database[rowPos].price}</i>`;
            bot.sendMessage(chatId, messageTemplate, {
                reply_markup: JSON.stringify(keyboardCatalog),
                parse_mode: 'HTML'
            })
        });
    }
}
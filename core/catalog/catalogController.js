const DB_MAIN = require('../db_core/databaseMainController');
const DB_CATALOG = require('./databaseCatalogController');

let rowPos = -1;            // позиция дб для каталога
let database = [];          // массив для полученной БД

// инлайновая клавиатура для каталога
const keyboard = {
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
    const imgurl = `${database[rowPos].photo}`;
    const messageTemplate = `<b>${database[rowPos].name}</b> \n <a href="${imgurl}">&#8205;</a> <a href="${imgurl}">&#8205;</a> <a href="${imgurl}">&#8205;</a> \n ${database[rowPos].description} \n\n <i>Цена: ${database[rowPos].price}</i>`;
    try {
        bot.editMessageText(
            messageTemplate,
            {
                chat_id: payload.message.chat.id,
                message_id: payload.message.message_id,
                reply_markup: JSON.stringify(keyboard),
                parse_mode: 'HTML'
            }
        );
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    editedKeyboard: {
        reply_markup: JSON.stringify(keyboard)
    },

    // событие при вызове клавиатуры: обновление БД, сброс переменной-позиции каталога
    keyboardActivate: function () {
        rowPos = -1;
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryList(resolve, reject, 'products');
        }).then( (res) => {
            database = res;
        });
    },

    getPreviousItem: function(bot, payload) {
        if(rowPos !== 0) {
            rowPos > 0 && rowPos--;
            getEntry(bot, payload);
        }
    },

    addItemToCart: function(bot, chatId) {
        DB_CATALOG.addNewOrder('orders', database[rowPos].product_id);

        // bot.editMessageText(payload.message.chat.id,'добавлено в корзину кек но будет подругому');
    },

    getNextItem: function(bot, payload) {
        if(rowPos < database.length) {
            (rowPos < database.length-1) && rowPos++;
            getEntry(bot, payload);
        }
    }
}
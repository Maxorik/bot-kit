const db = require('./database');

let db_row_position = -1;    // позиция дб для каталога
let database = [];           // массив для полученной БД

// инлайновая клавиатура для каталога, изменяющая текст
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

module.exports = {
    editedKeyboard: {
        reply_markup: JSON.stringify(keyboard)
    },

    // событие при вызове клавиатуры: обновление БД, сброс переменной-позиции каталога
    keyboardActivate: function () {
        db_row_position = -1;
        new Promise((resolve, reject) => {
            db.getEntryList(resolve, reject, 'products');
        }).then( (res) => {
            database = res;
        });
    },

    getPreviousItem: function(bot, chatId, payload) {
        if(db_row_position !== 0) {
            db_row_position > 0 && db_row_position--;
            const messageTemplate = `<b>${database[db_row_position].name}</b> \n\n ${database[db_row_position].description} \n\n <i>Цена: ${database[db_row_position].price}</i>`;
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
    },

    addItemToCart: function(bot, chatId, payload) {
        bot.editMessageText(chatId,'добавлено в корзину кек но будет подругому');
        console.log(payload);
    },

    getNextItem: function(bot, chatId, payload) {
        if(db_row_position < database.length) {
            (db_row_position < database.length-1) && db_row_position++;
            const messageTemplate = `<b>${database[db_row_position].name}</b> \n\n ${database[db_row_position].description} \n\n <i>Цена: ${database[db_row_position].price}</i>`;
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
    }
}
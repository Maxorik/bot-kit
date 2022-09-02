const fake_db = [
    {
        id: 1,
        text: 'first database row',
    }, {
        id: 2,
        text: 'second database row',
    }, {
        id: 3,
        text: 'third database row',
    }
];

// TODO перенести в глобальную переменную, обнулять при вызове клавиатуры
let db_row_position = -1;    // позиция дб для каталога

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

    getPreviousItem: function(bot, chatId, payload) {
        if(db_row_position !== 0) {
            db_row_position > 0 && db_row_position--;
            try {
                bot.editMessageText(
                    `${fake_db[db_row_position].text}`,
                    {  chat_id: payload.message.chat.id,
                        message_id: payload.message.message_id,
                        reply_markup: JSON.stringify(keyboard)
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
        if(db_row_position < fake_db.length) {
            (db_row_position < fake_db.length-1) && db_row_position++;
            try {
                bot.editMessageText(
                    `${fake_db[db_row_position].text}`,
                    {
                        chat_id: payload.message.chat.id,
                        message_id: payload.message.message_id,
                        reply_markup: JSON.stringify(keyboard)
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
    }
}
const db = require('../database/database');

// клавиатура для выбора категории контента
module.exports = {
    contentCategoryKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: 'Кошки',
                    callback_data: 'setBoobsCategory'
                }], [{
                    text: 'Киски',
                    callback_data: 'setButtCategory'
                }], [{
                    text: 'Коты',
                    callback_data: 'setGachiCategory'
                }],
            ]
        })
    },

    setContentType: async (bot, chatId, contentType) => {
        await db.updateUserSettings(bot, chatId, 'content', contentType);
    }
}


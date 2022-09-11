const db = require('./database');

module.exports = {
    testKeyboard: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{
                    text: 'Foo',
                    callback_data: 'setFoo'
                }], [{
                    text: 'Bar',
                    callback_data: 'setBar'
                }]
            ]
        })
    },

    updateDataBase: async (bot, chatId, contentType) => {
        await db.updateEntry(bot, chatId, 'content', contentType);
    }
}


const DB_MAIN = require("../db_core/databaseMainController");
let database = [];

const keyboardOrders = {
    inline_keyboard: [
        [{
            text: 'Оплатить',
            callback_data: 'payOrder'
        }]
    ]
};

function getOrdersList(bot, chatId) {
    let ordersTemplate = '';
    let messageParams = {
        parse_mode: 'HTML'
    }

    if(database.length > 0) {
        database.forEach((order, i) => {
            // TODO кнопка УДАЛИТЬ
            ordersTemplate += `${i+1}. ${order.name}, цена: <b>${order.price}</b>, <a href="/delete ${order.order_id}">УДАЛИТЬ</a> \n`
        })
        messageParams.reply_markup = JSON.stringify(keyboardOrders);
    } else {
        ordersTemplate = 'Заказов пока нет';
    }

    bot.sendMessage(chatId, ordersTemplate, messageParams);
}

module.exports = {
    ordersInit: function (bot, chatId) {
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryParamList(resolve, reject, 'orders', 'user', chatId);
        }).then( (res) => {
            database = res;
            getOrdersList(bot, chatId);
        });
    }
}
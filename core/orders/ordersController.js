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
    database.forEach((order, i) => {
        // TODO добавить кол-во, если >1  ${order.count}шт.
        // TODO кнопка УДАЛИТЬ
        ordersTemplate += `${i+1}. ${order.name}, цена: <b>${order.price}</b>, <a href="/delete ${order.order_id}">УДАЛИТЬ</a> \n`
    })

    bot.sendMessage(chatId, ordersTemplate, {
        reply_markup: JSON.stringify(keyboardOrders),
        parse_mode: 'HTML'
    })
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
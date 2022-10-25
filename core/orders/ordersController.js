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

// получить список заказов, добавленных в корзину
function getOrdersList(bot, chatId) {
    let ordersTemplate = '';
    let messageParams = {
        parse_mode: 'HTML'
    }

    if(database.length > 0) {
        let totalPrice = 0;
        database.forEach((order, i) => {
            const count = order.count > 1 ? ` (${order.count} шт.)` : '';
            ordersTemplate += `${i+1}. ${order.name}${count}, цена: <b>${order.price * +order.count}</b>\n`;
            totalPrice = totalPrice + (+order.price * +order.count);
            keyboardOrders.inline_keyboard.push([{
                text: `Удалить ${order.name}`,
                callback_data: `cancelOrder${order.order_id}`
            }])
        })
        keyboardOrders.inline_keyboard[0][0].text += ` ${totalPrice}`;
        messageParams.reply_markup = JSON.stringify(keyboardOrders);
    } else {
        ordersTemplate = 'Заказов пока нет';
    }

    bot.sendMessage(chatId, ordersTemplate, messageParams);
}

// убрать из корзины товары с id
function deleteItem(bot, chatId, id) {
    const orderId = id.match(/\d+/)[0];
    try {
        new Promise((resolve, reject) => {
            DB_MAIN.deleteEntry(orderId, 'orders', 'order_id', resolve, reject);
        }).then( () => {
            new Promise((resolve, reject) => {
                DB_MAIN.getEntryParamList(resolve, reject, 'orders', 'user', chatId);
            }).then((res) => {
                database = res;
                getOrdersList(bot, chatId);
            });
        });
    } catch (e) { console.log(e) }
}

module.exports = {
    ordersInit: function (bot, chatId) {
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryParamList(resolve, reject, 'orders', 'user', chatId);
        }).then((res) => {
            database = res;
            getOrdersList(bot, chatId);
        });
        bot.on('callback_query', (query) => {
            switch (query.data) {
                case 'payOrder':
                    // ordersInit(bot, chatId);
                    break;
                case String(query.data.match(/cancelOrder\d+/)):
                    deleteItem(bot, chatId, query.data);
                    break;
            }
        });
    }
}
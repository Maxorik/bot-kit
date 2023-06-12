const DB_MAIN = require("../db_core/databaseMainController");
let database = [];
let wasInit = false;

const keyboardOrders = {
    inline_keyboard: [
        [{
            text: 'Оплатить',
            callback_data: 'payOrder'
        }]
    ]
};

// TODO добавить поменять проверку адреса, добавить адрес в текст
// получить список заказов, добавленных в корзину
function getOrdersList(bot, chatId) {
    let ordersTemplate = '';
    let messageParams = {
        parse_mode: 'HTML'
    }

    // сброс клавиатуры к исходному состоянию
    if(keyboardOrders.inline_keyboard.length > 1) {
        keyboardOrders.inline_keyboard = [
            [{
                text: 'Оплатить',
                callback_data: 'payOrder'
            }]
        ]
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
        }).then(res => {
            database = res;
            getOrdersList(bot, chatId);
        });
    } catch (e) { console.log(e) }
}

// проверка, указан ли адрес доставки
function checkAddress(bot, chatId) {
    new Promise((resolve, reject) => {
        DB_MAIN.getEntryParamList(resolve, reject, 'users', 'user_id', chatId);
    }).then(res => {
        res[0].address ? payOrder(bot, chatId) : bot.sendMessage(chatId, 'Пожалуйста, укажите ваш адрес, выполнив /address');
    });
}

// вызов платежной формы, смена статуса заказа
function payOrder(bot, chatId) {
    console.log('payed');
}

module.exports = {
    ordersInit: function (bot, chatId) {
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryParamList(resolve, reject, 'orders', 'user', chatId);
        }).then(res => {
            database = res;
            getOrdersList(bot, chatId);
        });

        !wasInit && bot.on('callback_query', query => {
            wasInit = true;
            switch (query.data) {
                case 'payOrder':
                    checkAddress(bot, chatId, query.data);
                    break;
                case String(query.data.match(/cancelOrder\d+/)):        // в колбэк приходит айди удаляемого заказа
                    deleteItem(bot, chatId, query.data);
                    break;
            }
        });
    }
}
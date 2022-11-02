const DB_MAIN = require('../db_core/databaseMainController');
// const DB_ORDERS = require('../orders/databaseOrdersController');
// const { ordersInit } = require('../orders/ordersController');

let wasInit = false;

// TODO пуш, чтобы юзер выбрал время и (?) дату доставки

module.exports = {
    addressInit: function (bot, chatId) {
        bot.sendMessage(chatId, 'Введите адрес, на который будет оформлена доставка. При необходимости можете указать любые комментарии для доставки (домофон, подъезд)');

        bot.on('message', msg => {
            const chatId = msg.chat.id;
            const text = msg.text;

            // TODO confirm keyboard -> add to db
            // TODO добавить кнопку, определяющую гелокацию и предлагающую установить ее как адрес (?? - квартира и прочее)

            console.log(text);
        });
    }
}
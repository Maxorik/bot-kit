const TelegramApi = require('node-telegram-bot-api');
const token = '';
const bot = new TelegramApi(token, {polling: true});

const DB_USERS = require('./core/users/databaseUsersController');

const { catalogInit } = require('./core/catalog/catalogController')
const { ordersInit } = require('./core/orders/ordersController')
const { addressInit } = require('./core/address/addressController')

// базовые команды
bot.setMyCommands([
    {command: '/catalog',   description: 'Каталог'},
    {command: '/orders',    description: 'Мои заказы'},
    {command: '/address',   description: 'Мой адрес'},
    {command: '/about',     description: 'Подробности'}
]);

// TODO сделать функции асинхронными
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    switch (text) {
        case '/start':
        case '/start s':
            DB_USERS.addNewUser(msg, 'users');
            break;
        case '/catalog':
            catalogInit(bot, chatId);
            break;
        case '/orders':
            ordersInit(bot, chatId);
            break;
        case '/address':
            addressInit(bot, chatId);
            break;
    }
});
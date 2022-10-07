const TelegramApi = require('node-telegram-bot-api');
const token = '5609418234:AAGfhkBszhLwM3TFKE7iCCgvJsZIQx-3O4o';
const bot = new TelegramApi(token, {polling: true});

const DB_USERS = require('./core/users/databaseUsersController');

const { editedKeyboard, keyboardActivate, getPreviousItem, addItemToCart, getNextItem } = require('./core/catalog/catalogController')


// базовые команды
bot.setMyCommands([
    {command: '/start',     description: 'Запуск бота'},
    {command: '/catalog',   description: 'Каталог'},
    {command: '/orders',    description: 'Мои заказы'},
    {command: '/address',   description: 'Мой адрес'},
    {command: '/about',     description: 'Подробности'}
]);

// TODO сделать функции асинхронными
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        // записываем пользователя в БД
        DB_USERS.addNewUser(msg, 'users');
    }

    if(text === '/catalog') {
        keyboardActivate();
        bot.sendMessage(chatId, "Здесь будет изменяемый текст. Тыкай кнопки", editedKeyboard);  // TODO выдавать первуб позицию каталога
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    switch (query.data) {
        // TODO вынести колбэки в отдельные места
        case 'getBack':
            getPreviousItem(bot, query)
            break;
        case 'buyItem':
            addItemToCart(bot, chatId)
            break;
        case 'getForward':
            getNextItem(bot, query)
            break;

        // default:
        //     break;
    }
});
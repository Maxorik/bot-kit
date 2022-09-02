const TelegramApi = require('node-telegram-bot-api');
const token = '5609418234:AAGfhkBszhLwM3TFKE7iCCgvJsZIQx-3O4o';
const bot = new TelegramApi(token, {polling: true});

// const cron = require('node-cron');
// const axios = require('axios');

const db = require('./core/database');
const ext = require('./core/extended');
const { testKeyboard } = require('./core/keyboard');

const { editedKeyboard, getPreviousItem, addItemToCart, getNextItem } = require('./core/editedKeyboard')


// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/keys', description: 'Клавиатура'},
    {command: '/database', description: 'Каталог'},
]);

// TODO сделать функции асинхронными
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        // записываем пользователя в БД
        // db.addNewUser(msg);

        bot.sendMessage(chatId, "User added");
    }

    if(text === '/keys') {
        bot.sendMessage(chatId, "Hello", testKeyboard);
    }

    if(text === '/database') {
        bot.sendMessage(chatId, "Здесь будет изменяемый текст. Тыкай кнопки", editedKeyboard);
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    switch (query.data) {
        case 'setFoo':
            updateDataBase(bot, chatId, 'foo');
            break;

        case 'setBar':
            updateDataBase(bot, chatId, 'bar');
            break;

        // TODO вынести колбэки в отдельные места
        case 'getBack':
            getPreviousItem(bot, chatId, query)
            break;
        case 'buyItem':
            addItemToCart(bot, chatId, query)
            break;
        case 'getForward':
            getNextItem(bot, chatId, query)
            break;

        // default:
        //     break;
    }
});
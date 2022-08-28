const TelegramApi = require('node-telegram-bot-api');
const token = '5609418234:AAGfhkBszhLwM3TFKE7iCCgvJsZIQx-3O4o';
const bot = new TelegramApi(token, {polling: true});

// const cron = require('node-cron');
// const axios = require('axios');

const db = require('./core/database');
const ext = require('./core/extended');
const { testKeyboard } = require('./core/keyboard');

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/keys', description: 'Клавиатура'},
]);

// TODO сделать функции асинхронными
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        // записываем пользователя в БД
        db.addNewUser(msg);

        bot.sendMessage(msg.chat.id, "User added");
    }

    if(text === '/keys') {
        bot.sendMessage(msg.chat.id, "Hello", testKeyboard);
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

        // default:
        //     break;
    }
});
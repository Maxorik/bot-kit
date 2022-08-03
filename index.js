const TelegramApi = require('node-telegram-bot-api');
const token = '5577923485:AAHdQ7-o5bQj0lp-nD9P-ni23-d0R_qZwFQ';    // TODO изменить
const bot = new TelegramApi(token, {polling: true});

const cron = require('node-cron');
const axios = require('axios');

const db = require('./src/database/database');
const ext = require('./src/extended');
const {contentCategoryKeyboard, setContentType} = require('./src/keyboards/contentCategory')

// базовые команды
bot.setMyCommands([
    {command: '/start', description: 'Запуск бота'},
    {command: '/catalog', description: 'Посмотреть ассортимент'}, // открываем БД, клавиатуру, просматриваем, как карусель
    {command: '/orders', description: 'Корзина заказов'},   // тоже самое, только для пользователя
    {command: '/myAddress', description: 'Мои данные'},     // вывести адрес и кнопку для изменения адреса. Добавить валидатор при изменении
    {command: '/buy', description: 'Оплатить заказ'}        // привязать umoney, оплата по id (?)
]);

// TODO сделать функции асинхронными
bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start' || text === '/start s') {
        // записываем пользователя в БД
        db.addNewUser(msg);
    }

    // TODO декомпозировать вынести в отд файл
    if(text === '/userlist') {
        new Promise((resolve, reject) => {
            db.getUserList(resolve, reject);
        }).then( (res) => {
            let userlist = res.map((user, i) => {
                let userDate = ext.getDate(new Date (user.date1 * 1000));
                return `${i+1}.   ${user.username},   ${user.first_name},   запуск:  ${userDate}\n`;
            });

            bot.sendMessage(chatId, `${userlist.join('')}`);
        });
    }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    switch (query.data) {
        case 'setBoobsCategory':
            setContentType(bot, chatId, 'boobs');
            break;

        case 'setButtCategory':
            setContentType(bot, chatId, 'butt');
            break;

        case 'setGachiCategory':
            setContentType(bot, chatId, 'gachi');
            break;

        default:
            setContentType(bot, chatId, 'boobs');
            break;
    }
});
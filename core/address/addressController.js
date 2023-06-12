const DB_MAIN = require('../db_core/databaseMainController');

let wasInit = false; // флаг, показывающий, была ли уже инициализация пакета в текущей сессии
let isInit = false;  // флаг, показывающий, был ли ввод текста сразу после инициализации пакета

// TODO пуш, чтобы юзер выбрал время и (?) дату доставки

module.exports = {
    addressInit: function (bot, chatId) {
        isInit = true;
        let userAddress;
        // получаем текущий адрес, если он есть
        new Promise((resolve, reject) => {
            DB_MAIN.getEntryParamList(resolve, reject, 'users', 'user_id', chatId);
        }).then(res => {
            userAddress = res[0].address ? res[0].address : 'не установлен';
            bot.sendMessage(chatId, `Введите адрес, на который будет оформлена доставка. При необходимости можете указать любые комментарии для доставки (домофон, подъезд). \nВаш текущий адрес: ${userAddress}`);

            !wasInit && bot.on('message', msg => {
                const chatId = msg.chat.id;
                const text = msg.text;
                wasInit = true;

                if(isInit) {
                    isInit = false;

                    new Promise((resolve, reject) => {
                        // TODO добавить валидацию адреса
                        DB_MAIN.updateEntry('user_id', chatId, 'users', 'address', text, resolve, reject);
                    }).then(err => {
                        !err ? bot.sendMessage(chatId, `Ваш адрес успешно изменен на следующий: \n${text}`) :
                            bot.sendMessage(chatId, `Не удалось изменить адрес`);
                    });
                }

                // TODO добавить кнопку, определяющую гелокацию и предлагающую установить ее как адрес (?? - квартира и прочее)
            });
        });
    }
}
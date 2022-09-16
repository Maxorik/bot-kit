const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./core/users.sqlite3');

// TODO создать метод для добавления заказа

// добавить нового пользователя в бд
function addNewUser(payload, tableName) {
    db.serialize(() => {
        const entryId = payload.from.id;
        let sqlGet = `SELECT user_id FROM ${tableName} WHERE user_id = ?`;
        let sqlInsert = `INSERT INTO ${tableName} (user_id, first_name, username, date1)
                                VALUES ("${payload.from.id}", "${payload.from.first_name}", "${payload.from.username}", "${payload.date}"`;

        // проверка, уникальный ли пользователь. Добавим только нового
        db.get(sqlGet, [entryId], (err, row) => {
            if(err) {
                console.log(err)
            }
            if (!err && !row) {
                db.run(sqlInsert);
            }
        });
    });
    // db.close();
}

// TODO добавить пользователя
// добавить новый заказ
function addNewOrder(tableName, productId) {
    db.serialize(() => {
        const orderState = 'на оформлении'; // TODO статусы заказа
        const orderId = Date.now().toString();
        let sqlInsert = `INSERT INTO ${tableName} (order_id, order_state, product)
                         VALUES ("${orderId}", "${orderState}", "${productId}")`;

        db.run(sqlInsert);
    });
    // db.close();
}

// получить список записей таблицы
function getEntryList(resolve, reject, tableName) {
    db.serialize(() => {
        let recordsList = [];
        db.each(`SELECT * FROM ${tableName}`, (err, row) => {
            recordsList.push(row);
        }, () => {
            // db.close(); - не надо (почему?)
            resolve(recordsList);
        });
    });
}

// обновить запись
function updateEntry(bot, entryId, tableName, paramName, paramValue) {
    db.serialize(() => {
        let sqlUpdate = `UPDATE ${tableName} SET ${paramName} = "${paramValue}" WHERE id = ${entryId}`;

        // TODO возвращать разное в зав-и от paramName
        db.run(sqlUpdate, (err, row) => {
            err ? console.log(err) : bot.sendMessage(entryId, `Тип контента изменен`);  // TODO изменить резолв
        });
    });
}

module.exports = { addNewUser, addNewOrder, getEntryList, updateEntry }
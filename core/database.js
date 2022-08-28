const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.sqlite3');
const tableName = 'users';

// добавить нового пользователя в бд
function addNewUser(payload) {
    db.serialize(() => {
        const userId = payload.from.id;
        let sqlGet = `SELECT id FROM ${tableName} WHERE id = ?`;
        let sqlInsert = `INSERT INTO ${tableName} (id, first_name, username, date1, date2, content, schedule)
                                 VALUES ("${payload.from.id}", "${payload.from.first_name}", "${payload.from.username}",
                                         "${payload.date}", "${payload.date}", "boobs", "work")`;

        db.get(sqlGet, [userId], (err, row) => {
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

// получить список пользователей
function getUserList(resolve, reject) {
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

// обновить настройки пользователя
function updateUserSettings(bot, userId, paramName, paramValue) {
    db.serialize(() => {
        let sqlUpdate = `UPDATE ${tableName} SET ${paramName} = "${paramValue}" WHERE id = ${userId}`;

        // TODO возвращать разное в зав-и от paramName
        db.run(sqlUpdate, (err, row) => {
            err ? console.log(err) : bot.sendMessage(userId, `Тип контента изменен`);
        });
    });
}

module.exports = { addNewUser, getUserList, updateUserSettings }
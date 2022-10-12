const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../store.sqlite3');
// const db = new sqlite3.Database('D:/projects/bot_kit/core/store.sqlite3');

// добавить нового пользователя в бд
function addNewUser(payload, tableName) {
    db.serialize(() => {
        const entryId = payload.from.id;
        let sqlGet = `SELECT user_id FROM ${tableName} WHERE user_id = ?`;
        let sqlInsert = `INSERT INTO ${tableName} (user_id, first_name, username, date1)
                                VALUES ("${payload.from.id}", "${payload.from.first_name}", "${payload.from.username}", "${payload.date}")`;

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
}

module.exports = { addNewUser }
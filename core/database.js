const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./core/users.sqlite3');

// добавить новую запись в бд
function addNewEntry(payload, tableName, dbKeys) {
    db.serialize(() => {
        const entryId = payload.from.id;
        let sqlGet = `SELECT id FROM ${tableName} WHERE id = ?`;
        let sqlInsert = `INSERT INTO ${tableName} (id, first_name, username, date1, date2, content, schedule)    // TODO keys
                                 VALUES ("${payload.from.id}", "${payload.from.first_name}", "${payload.from.username}",
                                         "${payload.date}", "${payload.date}")`;

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

module.exports = { addNewEntry, getEntryList, updateEntry }
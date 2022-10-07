const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../store.sqlite3');

// получить список записей таблицы
function getEntryList(resolve, reject, tableName) {
    db.serialize(() => {
        let recordsList = [];
        db.each(`SELECT * FROM ${tableName}`, (err, row) => {
            recordsList.push(row);
        }, () => {
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

module.exports = { getEntryList, updateEntry }
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../store.sqlite3');
// const db = new sqlite3.Database('D:/projects/bot_kit/core/store.sqlite3');

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

// получить список записей таблицы с определенным параметром (id напр.)
function getEntryParamList(resolve, reject, tableName, param, paramValue) {
    db.serialize(() => {
        let recordsList = [];
        db.each(`SELECT * FROM ${tableName} WHERE ${param} = ${paramValue}`, (err, row) => {
            recordsList.push(row);
        }, () => {
            resolve(recordsList);
        });
    });
}

// получить список записей таблицы с набором определенных параметров
// на входе получаем объект params = { param1: paramValue1, param2: paramValue2...... }
function getEntryManyParamsList(resolve, reject, tableName, params) {
    let paramString = '';
    for(const property in params) {
        paramString += ` AND ${property} = ${params[property]}`;
    }
    paramString = paramString.substring(5); // убираем первую _AND_

    db.serialize(() => {
        let recordsList = [];
        db.each(`SELECT * FROM ${tableName} WHERE ${paramString}`, (err, row) => {
            recordsList.push(row);
        }, () => {
            resolve(recordsList);
        });
    });
}

// обновить запись
// TODO добавить колбэк в параметры (?)
function updateEntry(entryId, tableName, paramName, paramValue) {
    db.serialize(() => {
        let sqlUpdate = `UPDATE ${tableName} SET ${paramName} = "${paramValue}" WHERE id = ${entryId}`;

        db.run(sqlUpdate);
    });
}

module.exports = { getEntryList, getEntryParamList, getEntryManyParamsList, updateEntry }
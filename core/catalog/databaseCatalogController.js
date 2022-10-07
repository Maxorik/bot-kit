const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../store.sqlite3');

// добавить заказ пользователю
function addNewOrder(resolve, reject, tableName) {
    // db.serialize(() => {
    //     let recordsList = [];
    //     db.each(`SELECT * FROM ${tableName}`, (err, row) => {
    //         recordsList.push(row);
    //     }, () => {
    //         resolve(recordsList);
    //     });
    // });
    console.log('заглушка addNewOrder')
}

module.exports = { addNewOrder }
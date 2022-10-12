const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../store.sqlite3');
// const db = new sqlite3.Database('D:/projects/bot_kit/core/store.sqlite3');

// добавить заказ пользователю
function addNewOrder(payload, tableName) {
    db.serialize(() => {
        let sqlInsert = `INSERT INTO ${tableName} (order_id, order_state, product, user, price, name)
                                VALUES ("${payload.order_id}", "${payload.state}", "${payload.product}", "${payload.user}", "${payload.price}", "${payload.name}")`;

        // отладчик для отлова ошибок
        db.run(sqlInsert, function(err) {
            if (err) {
                return console.log(err.message);
            }
        });
    });
}

module.exports = { addNewOrder }
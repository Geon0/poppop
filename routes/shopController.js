const express = require('express');
const router = express.Router();
const db_config = require('../config/db.js');
const conn = db_config.init();
db_config.connect(conn);

router.use(express.urlencoded({
    extended: true
}));

router.get('/', function(req, res, next) {
    res.send('shop controller');
});

router.get('/get-shopList', (req, res) => {
    const sql = `SELECT * FROM SHOP_TB`;

    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
})

module.exports = router;

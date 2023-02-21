const express = require('express');
const router = express.Router();
const db_config = require('../config/db.js');
const conn = db_config.init();
db_config.connect(conn);

router.use(express.urlencoded({
    extended: true
}))

router.get('/', function(req, res, next) {
    res.send('member controller');
});

router.get('/all', (req, res) => {
    const sql = 'SELECT * FROM member';
    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
});

router.get('/getMember', (req, res) => {
    const {idx} = req.query;
    const sql = `SELECT * FROM member WHERE idx = ${idx}`;
    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
})

router.get('/getQuery/:name', (req, res) => {
    const {name} = req.params;
    res.send(`Hello ${name}`);
})

router.post('/postQuery', (req, res) => {
    const {name} = req.body;
    res.send(`Hello ${name}`);
})

module.exports = router;

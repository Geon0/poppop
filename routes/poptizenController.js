const express = require('express');
const router = express.Router();
const db_config = require('../config/db.js');
const conn = db_config.init();
db_config.connect(conn);

router.use(express.urlencoded({
    extended: true
}))

function generateNum() {
    const randomNumber = Math.floor(Math.random() * 5);
    return Math.floor(randomNumber);
}

router.get('/', function(req, res, next) {
    res.send('poptizen controller');
});


router.get('/get-poptizen-info', (req, res) => {
    const sql = `SELECT * FROM poptizen`;

    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
})

router.get('/get-poptizen-owned-info', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT * from poptizen p JOIN poptizen_status ps ON p.id = ps.poptizen_id JOIN poptizen_user_owned puo ON ps.id = puo.poptizen_id WHERE puo.member_id = ${id}`;
    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
})

router.post('/catch-poptizen', async (req, res) => {

    const lv = req.body.lv;
    const pId = req.body.pId;
    const mId = req.body.mId;
    const str = generateNum();
    const dex = generateNum();
    const con = generateNum();
    const int = generateNum();
    const pp = generateNum();
    const hp_status = lv * 1000;
    let pStatusId = 0;

    const sql1 = {
        poptizen_id : pId,
        str : str,
        dex : dex,
        con : con,
        int : int,
        pp : pp,
        hp_status : hp_status
    };
    conn.query('insert into poptizen_status set ?',sql1,function (err, results, fields){
        if (err)
            throw err;
        pStatusId = results.insertId;
        const sql2 = {
            member_id : mId,
            poptizen_id : pStatusId
        };

        conn.query('insert into poptizen_user_owned set ?',sql2,function (err, results, fields){
            if (err)
                throw err;
            res.json({code:'success'});
        });
    });
})

module.exports = router;

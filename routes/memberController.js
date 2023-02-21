const express = require('express');
const router = express.Router();
const db_config = require('../config/db.js');
const conn = db_config.init();
db_config.connect(conn);

const crypto = require('crypto');
const util = require('util');

router.use(express.urlencoded({
    extended: true
}))

//암호화
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const createSalt = async () => {
    const buf = await randomBytesPromise(64);
    return buf.toString("base64");
};

const createHashedPassword = async (password) => {
    const salt = await createSalt();
    const key = await pbkdf2Promise(password, salt, 104906, 64, "sha512");
    const hashedPassword = key.toString("base64");
    return { hashedPassword, salt };
};

const verifyPassword = async (password, userSalt, userPassword) => {
    const key = await pbkdf2Promise(password, userSalt, 104906, 64, "sha512");
    const hashedPassword = key.toString("base64");
    console.log('ha',hashedPassword);
    console.log('userPassword',userPassword);
    if (hashedPassword === userPassword) return true;
    return false;
};

router.get('/', function(req, res, next) {
    res.send('member controller');
});

router.get('/get-member-all', (req, res) => {
    console.log('in');
    const sql = 'SELECT * FROM MEMBER_TB';
    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
});

router.get('/get-member-info', (req, res) => {
    const {id} = req.query;
    const sql = `SELECT * FROM MEMBER_TB WHERE id = ${id}`;
    conn.query(sql, function (err,rows,fields) {
        if(err) console.log('query'+err);
        else res.send(rows);
    })
})

router.post('/register-id', async (req, res) => {

    const email = req.body.email;
    const {hashedPassword, salt} = await createHashedPassword(req.body.pw);
    const nick_name = req.body.nick_name;
    const name = req.body.name || null;
    const birth_date = req.body.birth_date || null;
    const profile_img = req.body.profile_img || null;
    const profile_comment = req.body.profile_comment || null;
    const set_date = new Date();
    const permission = req.body.permission || 0;

    const sql = {
        email: email,
        pw : hashedPassword,
        nick_name : nick_name,
        name : name,
        birth_date : birth_date,
        profile_img : profile_img,
        profile_comment : profile_comment,
        set_date : set_date,
        del_date : null,
        permission : permission,
        salt : salt
    };

    conn.query('insert into MEMBER_TB set ?',sql,function (err, results, fields){
        if (err)
            throw err;
        let member_no = results.insertId;
        res.json({member_no:member_no});
    });
})


router.get('/login', async (req, res) => {

    const email = req.query.email;
    const pw = req.query.pw;

    const sql = 'SELECT * FROM MEMBER_TB WHERE email = ?';
    conn.query(sql,email, async function (err, rows, fields) {
        let db_pw = null;
        let salt = null;
        if (err) console.log('query' + err);
        else {
            db_pw = rows[0].pw;
            salt = rows[0].salt;
        }
        const validate = await verifyPassword(pw, salt, db_pw);
        if(validate) {
            res.json(rows);
        }else {
            res.json('not match');
        }
    })
})


module.exports = router;

const express = require('express')
const router = express.Router()

const db = require('../../db/index')
const jwt = require('jsonwebtoken')
const config = require('../../config')

router.use(function (req, res, next) {
    if (!(req.body.usr.length >= 5 && req.body.usr.length <= 20) || !(req.body.pwd.length >= 6 && req.body.pwd.length <= 12)) {
        return res.send({
            status: 0,
            message: '用户名或密码不合法'
        })
    }
    next()
})

router.post('/', function (req, res) {
    db.query({
        sql: 'select * from ' + ((req.body.type === 's') ? 'user_s' : 'user_t') + ' where `usr` = ?',
        values: [req.body.usr],
    }, function (err, rows) {
        if (err) {
            return res.send({
                status: 0,
                message: err.sqlMessage
            })
        }
        if (rows.length === 0) {
            return res.send({
                status: 0,
                message: '用户名不存在'
            })
        }
        if (rows[0].pwd != req.body.pwd) {
            return res.send({
                status: 0,
                message: '密码错误'
            })
        }
        
        var user = rows[0]
        const mytoken = jwt.sign({ user }, config.key, {
            expiresIn: config.time,
            algorithm: config.alg,
        })
        res.send({
            status: 1,
            message: '登录成功',
            token: 'Bearer ' + mytoken,
        })
    });
})

module.exports = router
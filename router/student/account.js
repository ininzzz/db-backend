const express = require('express')
const router = express.Router()

const db = require('../../db/index')


router.post('/', function (req, res) {
    if (req.body.npwd == req.body.opwd) {
        return res.send({
            status: 0,
            message: '旧密码和新密码不能重复'
        })
    }
    db.query({
        sql: 'select * from user_s where `usr` = ? and `pwd` = ?',
        values: [req.user.user.usr,req.body.opwd]
    }, function (err, rows) {
        if (err) {
            return res.send({
                status: 0,
                message: err.sqlMessage
            })
        }
        if (rows.length == 0) {
            return res.send({
                status: 0,
                message: '密码错误'
            })
        }
        db.query({
            sql: 'update user_s set `pwd` = ? where `usr` = ?',
            values: [req.body.npwd,req.user.user.usr]
        }, function (err, rows) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err.sqlMessage
                })
            }
            if (rows.affectedRows > 0) {
                return res.send({
                    status: 1,
                    message: "修改成功"
                })
            }
            else {
                return res.send({
                    status: 0,
                    message: "修改失败"
                })
            }
        })
    })
})


module.exports = router
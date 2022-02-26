const express = require('express')
const moment = require('moment')
const router = express.Router()

const db = require('../../db/index')


router.post('/', function (req, res) {
    if (req.body.type == 'show') {
        db.query({
            sql: 'select t.id as id,\
                t.name as name,\
                t.gender as gender,\
                t.title as title,\
                t.telephone as telephone,\
                t.email as email,\
                t.website as website,\
                t.field as field,\
                c.name as college\
            from teacher as t, college as c\
            where t.id = ? and t.college_id = c.id',
            values: [req.user.user.usr],
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
                    message: '用户信息不存在'
                })
            }
            res.send({
                status: 1,
                message: '获取用户信息成功!',
                data: {
                    id: rows[0].id,
                    name: rows[0].name,
                    gender: rows[0].gender,
                    college: rows[0].college,
                    title: rows[0].title,
                    telephone: rows[0].telephone,
                    email: rows[0].email,
                    field: rows[0].field,
                    website: rows[0].website
                }
            })
        });
    }
    else {
        var user = req.user.user;
        db.query({
            sql: 'update teacher\
              set telephone = ?,\
                  email = ?,\
                  website = ?,\
                  field = ?\
              where id = ?',
            values: [req.body.data.telephone, req.body.data.email, req.body.data.website, req.body.data.field, user.usr],
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
    }
})


module.exports = router
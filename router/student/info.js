const express = require('express')
const moment = require('moment')
const router = express.Router()

const db = require('../../db/index')


router.post('/', function (req, res) {
    if (req.body.type == 'show') {
        db.query({
            sql: 'select s.id as id,\
                s.name as name,\
                s.gender as gender,\
                s.birth as birth,\
                s.telephone as telephone,\
                s.email as email,\
                s.website as website,\
                s.info as info,\
                c.name as college,\
                m.name as major\
            from student as s, college as c, major as m \
            where s.id = ? and s.college_id = c.id and s.major_id = m.id',
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
                    major: rows[0].major,
                    birth: moment(rows[0].birth).format("YYYY-MM-DD"),
                    college: rows[0].college,
                    major: rows[0].major,
                    telephone: rows[0].telephone,
                    email: rows[0].email,
                    info: rows[0].info,
                    website: rows[0].website
                }
            })
        });
    }
    else {
        var user = req.user.user;
        db.query({
            sql: 'update student\
              set telephone = ?,\
                  email = ?,\
                  website = ?,\
                  info = ?\
              where id = ?',
            values: [req.body.data.telephone, req.body.data.email, req.body.data.website, req.body.data.info, user.usr],
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


module.exports=router
const { valid } = require('@hapi/joi/lib/base')
const values = require('@hapi/joi/lib/values')
const express = require('express')
const moment = require('moment')
const router = express.Router()

const db = require('../../db/index')


router.post('/', function (req, res) {
    if (req.body.type == 'show') {
        db.query({
            sql: 'select\
                s.id as id,\
                s.name as name,\
                s.gender as gender,\
                s.birth as birth,\
                c.name as college,\
                m.name as major,\
                s.telephone as telephone,\
                s.email as email,\
                s.website as website,\
                s.info as info\
            from student as s, college as c, major as m, selection as ss\
            where s.college_id = c.id and s.major_id = m.id and ss.teacher_id = ? and ss.student_id = s.id and ss.status = 0',
            values: [req.user.user.usr]
        }, function (err, rows) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err.sqlMessage
                })
            }
            else {
                for (var i = 0; i < rows.length; i++) rows[i].birth = moment(rows[i].birth).format("YYYY-MM-DD");
                return res.send({
                    status: 1,
                    message: "查询成功",
                    length: rows.length,
                    data: rows
                })
            }
        })
    }
    else {
        db.query({
            sql: 'select count(*) as cnt from selection where student_id = ? and status = 2',
            values: [req.body.id]
        }, function (err, rows) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err.sqlMessage
                })
            }
            if (rows[0].cnt > 0 && req.body.status == 1) {
                return res.send({
                    status: 0,
                    message: '该学生已被其他老师选择'
                })
            }
            db.query({
                sql: 'update selection set status = ? where teacher_id = ? and student_id = ?',
                values: [req.body.status == 0 ? 2 : 1, req.user.user.usr, req.body.id]
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
                        message: "操作成功"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "操作失败"
                    })
                }
            })
        })
    }
})


module.exports = router
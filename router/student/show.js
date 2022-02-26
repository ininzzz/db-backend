const express = require('express');
const router = express.Router();

const db = require('../../db/index')

router.post('/', function (req, res) {
    if (req.body.type == 'show') {
        db.query({
            sql: 'select\
                t.id as id,\
                t.name as name,\
                t.gender as gender,\
                t.title as title,\
                c.name as college,\
                t.telephone as telephone,\
                t.email as email,\
                t.website as website,\
                t.field as field,\
                s.status as status\
            from teacher as t, college as c, selection as s\
            where t.college_id = c.id and s.student_id = ? and s.teacher_id = t.id',
            values: [req.user.user.usr]
        }, function (err, rows) {
            if (err) {
                return res.send({
                    status: 0,
                    message: err.sqlMessage
                })
            }
            else {
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
        if (req.body.id == null) {
            return res.send({
                status: 0,
                message: '教师id不能为空'
            })
        }
        db.query({
            sql: 'select status from selection where teacher_id = ? and student_id = ?',
            values: [req.body.id, req.user.user.usr]
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
                    message: '未知的错误'
                })
            }
            else if (rows[0].status > 0) {
                return res.send({
                    status: 0,
                    message: '不可撤销'
                })
            }
            db.query({
                sql: 'delete from selection where teacher_id = ? and student_id = ?',
                values: [req.body.id, req.user.user.usr]
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
                        message: "撤销成功"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "撤销失败"
                    })
                }
            })
        })
    }
})

module.exports = router;
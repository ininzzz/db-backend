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
            where s.college_id = c.id and s.major_id = m.id and ss.teacher_id = ? and ss.student_id = s.id and ss.status = 1',
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
})


module.exports = router
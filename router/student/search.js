const express = require('express');
const router = express.Router();

const db = require('../../db/index')

const max_num_t = 5;
const max_num_s = 3;

router.post('/', function (req, res) {
    if (req.body.type == 'search') {
        teachers = req.body;
        var keyword_name = 't.name ' + ((teachers.keyword.name == null) ? ('is not null') : ('like \'%' + teachers.keyword.name) + '%\'')
        var keyword_field = '(t.field ' + ((teachers.keyword.field == null) ? ('is not null or t.field is null)') : ('like \'%' + teachers.keyword.field) + '%\')')
        var keyword_college = 'c.name ' + ((teachers.keyword.college == null) ? ('is not null') : ('= \'' + teachers.keyword.college) + '\'')
        var keyword_title = 't.title ' + ((teachers.keyword.title == null) ? ('is not null') : ('= \'' + teachers.keyword.title) + '\'')
        db.query({
            sql: 'select\
                SQL_CALC_FOUND_ROWS\
                t.id as id,\
                t.name as name,\
                t.gender as gender,\
                t.title as title,\
                c.name as college,\
                t.telephone as telephone,\
                t.email as email,\
                t.website as website,\
                t.field as field,\
                (select count(*) from selection as s where t.id = s.teacher_id and s.status = 0) as apply_num,\
                (select count(*) from selection as s where t.id = s.teacher_id and s.status = 1) as accept_num,\
                (select ?) as max_num\
            from teacher as t, college as c\
            where t.college_id = c.id'
                + ' and ' + keyword_college
                + ' and ' + keyword_title
                + ' and ' + keyword_name
                + ' and ' + keyword_field
                + ' limit ?, ?;\
                select FOUND_ROWS() as all_num;',
            values: [max_num_t, (req.body.page - 1) * req.body.size, req.body.size]
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
                    length: Math.ceil(rows[1][0].all_num / req.body.size),
                    data: rows[0]
                })
            }
        })
        
    }
    else {
        db.query({
            sql: 'select\
                    (select count(*) from selection where teacher_id = ? and status = 1) as num1,\
                    (select count(*) from selection where student_id = ? and status < 2) as num2',
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
            if (rows[0].num1 >= max_num_t) {
                return res.send({
                    status: 0,
                    message: "人数已满"
                })
            }
            else if (rows[0].num2 >= max_num_s) {
                return res.send({
                    status: 0,
                    message: "选择已达上限"
                })
            }
            db.query({
                sql: 'insert into selection(student_id,teacher_id,status) value(?,?,?)',
                values: [req.user.user.usr, req.body.id, 0]
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
                        message: "选择成功"
                    })
                }
                else {
                    return res.send({
                        status: 0,
                        message: "选择失败"
                    })
                }
            })
        })
    }
})

module.exports = router;
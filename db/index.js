const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'web2',
})

module.exports = db
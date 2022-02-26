const express = require('express')
const cors = require('cors')
// router
const user = require('./router/login/login')
const student = require('./router/student/student')
const teacher = require('./router/teacher/teacher')

// token
const express_jwt = require('express-jwt')
const config = require('./config')

const app = express()

// prework
app.use(cors())
app.use(express.json())
app.use(express_jwt({
    secret: config.key,
    algorithms: [config.alg],
}).unless({
    path: [
        '/login'
    ],
}))
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.send({
            status: 0,
            message: 'invalid token'
        })
    }
    next()
})


// router
app.use('/login', user)
app.use('/student', student)
app.use('/teacher', teacher);

app.listen(80, function () {
    console.log('server is running...');
})

// now:114849
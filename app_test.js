const express = require('express')

const app = express()

app.get('/', function (req, res) {
    res.send('ok');
})

app.listen(12345, function () {
    console.log('server is running...');
})

// now:114849
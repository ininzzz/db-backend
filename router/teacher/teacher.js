const express = require('express');
const router = express.Router();

const info = require('./info')
const account = require('./account')
const show = require('./show')
const selected = require('./selected')

router.use('/info', info)
router.use('/account', account)
router.use('/show', show)
router.use('/selected', selected)

module.exports = router;
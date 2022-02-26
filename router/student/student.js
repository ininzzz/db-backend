const express = require('express');
const router = express.Router();

const info = require('./info')
const search = require('./search')
const account = require('./account')
const show = require('./show')

router.use('/info', info)
router.use('/search',search)
router.use('/account',account)
router.use('/show',show)

module.exports = router;
const express = require('express');
const router = express.Router();
const user = require('./user');
const config = require('../config');

router.use('/user', user);


router.use((req, res, next) => {
    res.status(404).json({
        code: 404,
        message: config.ERROR.INVALID_URL
    })
    return;
});

module.exports = router;
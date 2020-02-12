const express = require('express');
const userCtr = require('../../controller/user')
const config = require('../../config');
const express_validate = require('express-joi-validator');
const validation = require('./validation');
const router = express.Router();


router.post('/signup', express_validate(validation.signup), userCtr.signUp);
router.get('/get_user', express_validate(validation.get_user), userCtr.getUser)

router.use((req, res, next) => {
    res.status(404).json({
        code: 404,
        message: config.ERROR.INVALID_URL
    })
    return;
});

module.exports = router
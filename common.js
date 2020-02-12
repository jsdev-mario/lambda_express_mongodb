const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const userCtr = require('./controller/user')
const moment = require('moment')

exports.generateToken = function (user) {
    var token = jwt.sign({
            userId: user._id.toString(),
            userType: user.userType,
        },
        config.secret, {
            expiresIn: 12 * 3600,
        })
    return token;
}

exports.generateAdminToken = function (user) {
    var token = jwt.sign({
            userId: user._id.toString(),
            userType: user.userType,
        },
        config.secret, {
            expiresIn: 5 * 3600,
        })
    return token;
}

exports.checkToken = async (req, res, next) => {
    try{
        // check header or url params or post params for token    
        var token = req.body.token || req.query.token || req.headers.token || req.params.token;
        if (token) { 
            const decoded = jwt.verify(token, config.secret);
            if (decoded.userId == undefined) {
                return res.status(400).json({
                    code: 400,
                    message: config.ERROR.INVALID_TOKEN,
                });
            }
            req.body.userId = decoded.userId;
            req.body.userType = decoded.userType;
            const user = await userCtr.get(req.body.userId);
            if (!user){
                return res.status(200).json({
                    code: 400,
                    message: config.ERROR.INVALID_TOKEN,
                });
            }else if (user.status === config.MEMBER_STATUS.BLOCKED){
                return res.status(200).json({
                    code: 400,
                    message: 'Account has been blocked. Please contact',
                });
            }
            next();
        } else {
            res.status(400).json({
                code: 400,
                message: config.ERROR.INVALID_TOKEN,
            });
        }    
    }catch(error) {
        console.log('jwt token', error)
        if (error.message === 'jwt expired'){
            res.status(400).json({
                code: 400,
                message: config.ERROR.INVALID_TOKEN,
            });
        }else{
            res.status(500).json({
                code: 500,
                message: config.ERROR.INVALID_TOKEN,
            });
        }
    }
}

exports.validateEmail = function (value) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}

exports.validatePhone = function (value) {
    var phoneno = /^\+?([0-9]{2})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})[- ]?([0-9]{4})$/;
    return value.match(phoneno);
}

exports.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.validPassword = function (login_pass, db_pass) {
    return bcrypt.compareSync(login_pass, db_pass);
};

exports.isNumber = function (string) {
    return !isNaN(parseFloat(string)) && isFinite(string);
}

exports.filterNumber = function (string) {
    try {
        var number = "";
        console.log(string);
        for (i = 0; i < string.length; i++) {
            if (this.isNumber(string[i])) {
                number += string[i]
            }
        }
        return number;
    } catch (e) {
        return 0;
    }
}

exports.firstLetterCapitalize = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

exports.filterAddress = function (val) {
    try {
        var value = val
        var numberArrary = value.match(/\d+/g);
        if (numberArrary != null) {
            numberArrary.forEach(number => {
                var temp = "";
                var tempArray = value.split(number);
                tempArray.forEach((addr, index) => {
                    temp += addr.trim() + " ";
                    if (index != tempArray.length - 1) {
                        temp += number + " ";
                    }
                });
                value = temp.trim();
            });
        }
        var temp1 = "";
        value.split(' ').forEach(addr => {
            temp1 += this.firstLetterCapitalize(addr) + " ";
        });
        return temp1.trim();
    } catch (e) {
        console.log(e);
        return val;
    }
}

exports.filterName = function (val) {
    try {
        console.log(val);
        var value = "";
        val.split(' ').forEach(str => {
            value += this.firstLetterCapitalize(str) + " ";
        });
        return value.trim();
    } catch (e) {
        console.log(e);
        return val;
    }
}

exports.convert16ID = (number) => {
    var _id = number;
    let character = "0123456789ABCDEF"
    var result = "";
    while (_id > 0) {
        result = character.charAt(_id % 16) + result;
        _id = Math.floor(_id / 16);
    }
    result = character[_id] + result;
    for (i = result.length; i < 5; i++) {
        result = "0" + result;
    }
    return result;
}

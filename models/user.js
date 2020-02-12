var mongoose = require('mongoose');
var common = require('../common');
var config = require('../config');


var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    gender: {
        type: Number,
        default: config.GENDER.NOPREFER
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    phoneNumber: {
        type:String,
    },
    notiToken: {
        type: String,
    }
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model("user", userSchema);

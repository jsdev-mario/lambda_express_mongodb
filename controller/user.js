
const userModel = require('../models/user');
const common = require('../common')
const config = require('../config')

exports.signUp = async(req, res, next) => {
    try{

        // create user        
        user = await userModel.create(req.body)
        // generate token

        const token = common.generateToken(user);

        return res.status(200).json({
            code: 200,
            data: user,
            token: token,
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            code: 500,
            message: config.ERROR.INTERAL_ERROR
        })
    }
}

exports.getUser = async(req, res, next) => {
    try{
        const user = await userModel.findById(req.query._id).lean()
        res.status(200).json({
            code: 200,
            data: user
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            code: 500,
            message: config.ERROR.INTERAL_ERROR
        })
    }
}

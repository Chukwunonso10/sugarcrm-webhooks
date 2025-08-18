const mongoose = require('mongoose')

const tokenModel = new mongoose.Schema({
    accessToken: {type: String},
    refreshToken: {type: String}
}, {timestamps: true})

const Token = mongoose.model("Token", tokenModel)
module.exports = Token;
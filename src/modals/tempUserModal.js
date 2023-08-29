const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: Array,
    },
    mobileNumber: {
        type: String,
    },
    otp: {
        type: Number,
    },
})

module.exports = mongoose.model('tempUsers', userSchema )             
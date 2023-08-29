const express = require('express')
const {  tempRegister , verifyOtp } = require('./tempController')
const router = express.Router()

router.post('/register' , tempRegister) // send OTP 
router.post('/verifyOtp' , verifyOtp)   // chack otp

router.get('/get' , (req,res)=>{
    res.json({msg : 'in get user otp'})
})

module.exports = router
const express = require('express')
const { UserProtect } = require('../../middlewere/TokenMiddlewere')
const { sendMSG, conversationList, getAllMassages } = require('./chatController')
const router = express.Router()

router.post('/send', UserProtect, sendMSG) 
router.post('/conversationList', UserProtect, conversationList) 
router.post('/getAllMassages', UserProtect, getAllMassages) 


router.get('/get' , (req,res)=>{
    res.json({msg : 'get chat'})
})

module.exports = router
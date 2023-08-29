const express = require('express')
const { createRoom } = require('./roomController')
const { UserProtect } = require('../../middlewere/TokenMiddlewere')
const router = express.Router()

router.post('/createRoom', UserProtect, createRoom)

router.get('/get' , (req,res)=>{
    res.json({msg : 'you are in Room'})
})

module.exports = router
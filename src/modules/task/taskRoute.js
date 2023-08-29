const express = require('express')
const { UserProtect } = require('../../middlewere/TokenMiddlewere')
const { createTask, getAllTask, getOneTask, getAllMyTask, filterTask } = require('./taskController')
const router = express.Router()

router.post('/createTask', UserProtect, createTask) 
router.get('/getAllTask', UserProtect, getAllTask) 
router.get('/getOneTask', UserProtect, getOneTask) 
router.get('/getAllMyTask', UserProtect, getAllMyTask) 
router.get('/filterTask', UserProtect, filterTask) 


const get = (req,res)=>{
    res.json({msg : 'get task'})
}
router.route('/get')
  .get(get)
  .post( get);

module.exports = router
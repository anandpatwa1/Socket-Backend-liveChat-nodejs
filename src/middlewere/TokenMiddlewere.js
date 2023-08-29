const jwt = require('jsonwebtoken')
const User = require('../modals/userModal')
const asyncHandler = require('express-async-handler')

const UserProtect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id)
            next()

        } catch (error) {
            res.status(401)
            throw new Error(error)
        }
    }
    else{
        res.status(401)
        throw new Error("Please login again")
    }
})

// const seveRoom = (req, res, room_id)=>{
//     req.room_id = room_id
// }

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  };
  
module.exports = {UserProtect , generateToken}
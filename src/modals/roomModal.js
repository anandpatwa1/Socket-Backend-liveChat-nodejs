const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
},
{
  timestamps: true,
}
)

module.exports = mongoose.model('rooms', userSchema, "rooms")
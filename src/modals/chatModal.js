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
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "rooms"
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "tasks",
        default : null
    },
    massage: {
        type: String,
    },
    time: {
        type: Date,
        default : new Date()
    },
    status: {
        type: String,
        enum: ['Unseen', 'delivered', 'seen'], 
        default: "Unseen" 
    },
    type: {
        type: String,
    },
},
{
  timestamps: true,
}
)

module.exports = mongoose.model('chats', userSchema)             
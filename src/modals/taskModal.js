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
    Description: {
        type: String,
    },
    OtherPeoples: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "users"
    }],
    AdditionalDetails: {
        type: String,
    },
    Attachment: {
        type: String,
    },
    Comments: [{
        type: String,
    }],
    time: {
        type: Date,
        default : new Date()
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Overdue'], 
        default: "Pending" 
    },
},
{
  timestamps: true,
}
)

module.exports = mongoose.model('tasks', userSchema, "tasks")             
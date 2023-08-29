const asyncHandler = require("express-async-handler");
const Room = require("../../modals/roomModal");

const createRoom = asyncHandler(async (req, res) => {
  const sender_id = req.user.id;
  const receiver_id = req.body.receiver_id;

  // chack existing room
  const existingRoom = await Room.findOne({
    sender_id: sender_id,
    receiver_id: receiver_id,
  });
  const existingReverseRoom = await Room.findOne({
    sender_id: receiver_id,
    receiver_id: sender_id,
  });
  if (existingRoom) {
    res.status(200).json(existingRoom);
  } else if (existingReverseRoom) {
    res.status(200).json(existingReverseRoom);
  } else {
    if (sender_id !== receiver_id) {
      if (sender_id || receiver_id) {
        const room = await Room.create({
          sender_id,
          receiver_id,
        });

        res.status(201).json({
          status: true,
          data: room,
        });
        
      } else {
        res.status(401);
        throw new Error("need receiver_id and sender_id for create chat box");
      }
    } else {
      res.status(400);
      throw new Error("receiver_id and sender_id can't same");
    }
  }
});

module.exports = { createRoom };

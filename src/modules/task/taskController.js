const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Chat = require("../../modals/chatModal");
const Task = require("../../modals/taskModal");
const Room = require("../../modals/roomModal");

// Create new Task
const createTask = asyncHandler(async (req, res) => {
  const { room_id, Description, AdditionalDetails } = req.body;
  const sender_id = req.user.id;

  const room = await Room.findById(room_id);

  let receiver_id = room.receiver_id;
  if (sender_id == receiver_id) {
    receiver_id = room.sender_id;
  }

  if (!Description || Description == "" || Description == undefined) {
    res.status(400);
    throw new Error("'Description' need any text content");
  } else {
    if (sender_id !== receiver_id) {
      if ((room_id && sender_id) || receiver_id) {
        const task = await Task.create({
          sender_id,
          receiver_id,
          room_id,
          Description,
          AdditionalDetails,
        });

        const chat = await Chat.create({
          task_id: task._id,
          sender_id,
          receiver_id,
          room_id,
          type: "Task",
        });

        res.status(201).json({
          status: true,
          massage: "task created ",
          data: task,
          chat: chat,
        });
      } else {
        res.status(401);
        throw new Error("need receiver_id and sender_id");
      }
    } else {
      res.status(400);
      throw new Error("receiver_id and sender_id can't same");
    }
  }
});

// get All Task accociated with Room ID
const getAllTask = asyncHandler(async (req, res) => {
  const { room_id } = req.body;

  if (!room_id || room_id == "" || room_id == undefined) {
    res.status(404);
    throw new Error("provide room_id");
  } else {
    // check room exist or not
    const check_room_id = await Room.findById(new ObjectId(room_id));
    if (!check_room_id) {
      res.status(404);
      throw new Error("Room not found");
    } else {
      const my_chats = await Task.aggregate([
        {
          $match: { room_id: new ObjectId(room_id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender_id",
            foreignField: "_id",
            as: "Sender",
          },
        },
        {
          $unwind: "$Sender",
        },
        {
          $lookup: {
            from: "users",
            localField: "receiver_id",
            foreignField: "_id",
            as: "Receiver",
          },
        },
        {
          $unwind: "$Receiver",
        },
        {
          $project: {
            sender_id: 1, // 1 means show n 0 means not show
            receiver_id: 1,
            room_id: 1,
            Description: 1,
            OtherPeoples: 1,
            AdditionalDetails: 1,
            Attachment: 1,
            time: 1,
            status: 1,
            "Sender.name": 1,
            "Sender.email": 1,
            "Sender.mobileNumber": 1,
            "Sender.userName": 1,
            "Sender.ProfileIcon": 1,
            "Receiver.name": 1,
            "Receiver.email": 1,
            "Receiver.mobileNumber": 1,
            "Receiver.userName": 1,
            "Receiver.ProfileIcon": 1,
          },
        },
      ]);

      res.status(200).json({
        status: true,
        data: my_chats,
      });
    }
  }
});

// get One Task (get by id)
const getOneTask = asyncHandler(async (req, res) => {
  const { task_id } = req.body;
  if (!task_id || task_id == "" || task_id == undefined) {
    res.status(404);
    throw new Error("'task_id' not found");
  } else {
    const task = await Task.findById(task_id);
    if (task) {
      res.status(200).json({
        status: true,
        massage: "Here is your task",
        data: task,
      });
    } else {
      res.status(404);
      throw new Error("Task not found");
    }
  }
});

// get All My Task by me or to me
const getAllMyTask = asyncHandler(async (req, res) => {
  const My_id = req.user.id;

  const my_room = await Task.aggregate([
    {
      $match: {
        $or: [
          { sender_id: new ObjectId(My_id) },
          { receiver_id: new ObjectId(My_id) },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: true,
    massage: "Here is your all tasks",
    data: my_room,
  });

});

// filter Task of
const filterTask = asyncHandler(async (req, res)=>{
  const user_id = req.user.id;

  const tasks = await Task.aggregate([
  {
    $group: {
      _id: "$status",
      data: { $push: "$$ROOT" }
    }
  },
  {
    $project: {
      _id: 0,
      status: "$_id",
      data: 1
    }
  }
]);
 
res.status(200).json({
  status: true,
  massage: "Here is your all tasks",
  tasks,
});

})

module.exports = { createTask, getAllTask, getOneTask, getAllMyTask, filterTask };

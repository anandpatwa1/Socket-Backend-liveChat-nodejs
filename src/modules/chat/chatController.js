const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const Chat = require("../../modals/chatModal");
const Room = require("../../modals/roomModal");
const User = require("../../modals/userModal");

const sendMSG = asyncHandler(async (req, res) => {
  const massage = req.body.massage;
  const room_id = req.body.room_id;
  const sender_id = req.user.id;

  const room = await Room.findById(room_id);

  let receiver_id = await room.receiver_id;
  if (sender_id == receiver_id) {
    receiver_id = room.sender_id;
  }

  if (!massage || massage == "" || massage == undefined) {
    res.status(400);
    throw new Error("massage need any text content");
  } else {
    if (sender_id !== receiver_id) {
      if ((room_id && sender_id) || receiver_id) {
        const chat = await Chat.create({
          sender_id,
          receiver_id,
          room_id,
          massage,
          type: "Massage",
        });
        res.status(201).json({
          status: true,
          massage: "chat start ",
          data: chat,
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

const conversationList = asyncHandler(async (req, res) => {
  const sender_id = req.user.id;

  // my all room id using find
  // const findList1 = await Room.find({ sender_id: sender_id });
  // const findList2 = await Room.find({ receiver_id: sender_id });

  // this will give me full room
  // const my_room = [...findList1, ...findList2]; // all room accosiated with me

  // my all room id using aggregate
  // this will give me only room id

  const my_room = await Chat.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $match: {
        $or: [
          { sender_id: new ObjectId(sender_id) },
          { receiver_id: new ObjectId(sender_id) },
        ],
      },
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
        massage: 1,
        time: 1,
        status: 1,
        type: 1,
        "Sender._id": 1,
        "Sender.name": 1,
        "Sender.email": 1,
        "Sender.userName": 1,
        "Sender.ProfileIcon": 1,
        "Sender.job_title": 1,
        "Receiver._id": 1,
        "Receiver.name": 1,
        "Receiver.email": 1,
        "Receiver.userName": 1,
        "Receiver.ProfileIcon": 1,
        "Receiver.job_title": 1,
      },
    },
    {
      $group: {
        _id: "$room_id",
        // data: { $push: "$$ROOT" }, // for all massages
        data: { $first: "$$ROOT" }, // for the first massage of given array
        total_unseen_massage: {
          $sum: { $cond: [{ $eq: ["$status", "Unseen"] }, 1, 0] },
        }, // task 1 Populate all Unseen massages
      },
    },
  ]);

  // Populate need ref in schema
  // const show = await Chat.populate(my_room[0].data, {
  //   path: "sender_id receiver_id room_id",
  //   select: [
  //     "name",
  //     "email",
  //     "mobileNumber",
  //     "userName",
  //     "ProfileIcon",
  //     "job_title",
  //   ],
  // });

  // const user = await User.findById(receiver_id)

  // const my_room = await Chat.find().populate('sender_id receiver_id ')

  res.status(200).json({
    status: true,
    data: my_room,
  });
  // res.json(show);

  // const allChat = await Chat.find({ room_id: "64e87485ad615ded9b73bffe" }); // give room id and get all chats

  // const allData = await Promise.all(
  //   my_room.map(async (room) => {
  //     const data = await Chat.find({ room_id: room._id.toString() }).sort({
  //       createdAt: -1,
  //     });
  //     //get receiver
  //     let receiver_id = await room.receiver_id;
  //     if (sender_id == receiver_id) {
  //       receiver_id = room.sender_id;
  //     }

  //     const user = await User.findById(receiver_id)
  //     return {
  //       total_msg: data.filter((data) => data.status == "Unseen").length,
  //       last_msg: data[0],
  //       user: user,
  //     };
  //   })
  // );

  // res.json(allData); // all room accosiated with me
});

const getAllMassages = asyncHandler(async (req, res) => {
  const { room_id } = req.body;

  if (!room_id || room_id == "" || room_id == undefined) {
    res.status(404);
    throw new Error("Please provide room_id");
  } else {
    // check room exist or not
    const check_room_id = await Room.findById(new ObjectId(room_id));
    if (!check_room_id) {
      res.status(404);
      throw new Error("Room not found");
    } else {
      const my_chats = await Chat.aggregate([
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
          $lookup: {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
            as: "Task",
          },
        },
        // {
        //   $unwind: "$Task",
        // },
        {
          $project: {
            sender_id: 1, // 1 means show n 0 means not show
            receiver_id: 1,
            room_id: 1,
            task_id: 1,
            massage: 1,
            time: 1,
            status: 1,
            type: 1,
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
            "Task.Description": 1,
            "Task.OtherPeoples": 1,
            "Task.AdditionalDetails": 1,
            "Task.Attachment": 1,
            "Task.Comments": 1,
            "Task.status": 1,
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

module.exports = { sendMSG, conversationList, getAllMassages };

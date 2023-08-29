const User = require("../../modals/userModal");
const TempUser = require("../../modals/tempUserModal");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../../middlewere/TokenMiddlewere");

// const getAllUser = async (req, res) => {
//   const getAllUser = await User.find().select("-password");
//   res.status(200).json({
//     status: true,
//     data: getAllUser,
//   });
// };
const getAllUser = async (req, res) => {
  const user = req.user._id;

  const getAllUsers = await User.aggregate([
    {
      $match: {
        _id: { $ne: user } // Exclude yourself based on your unique identifier
      }
    }
  ]);

  // res.status(200).json(getAllUsers);
  res.status(200).json({
    status: true,
    data: getAllUsers,
  });
};

// update Profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, mobileNumber, userName, ProfileIcon, job_title } =
    req.body;

  if (name || email || mobileNumber || userName || ProfileIcon || job_title) {
    let oldEmails = await User.findById(req.user.id);
    const oldNumbers = await User.findById(req.user.id);
    // const temp = oldNumbers?.mobileNumber
    // const newNumbs = temp
    // console.log(newNumbs);
    const data = {
      mobileNumber,
      userName,
      ProfileIcon,
      job_title,
    };

    let user = await User.findByIdAndUpdate(req.user.id, data, {
      new: true,
    });

    if (oldEmails.email.includes(email) && email != undefined) {
    } else {
      user.email.push(email);
    }

    if (
      oldEmails.mobileNumber.includes(mobileNumber) &&
      mobileNumber != undefined
    ) {
    } else {
      user.mobileNumber.push(mobileNumber);
    }
    user.save();

    res.status(200).json({
      status: true,
      data: user,
    });
  } else {
    res.status(401);
    throw new Error("enter any value");
  }
});

// login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.send("enter email and otp field");
  }
  const userLogin = await User.findOne({ email: email });

  if (userLogin && otp == 9977) {
    res.status(201).json({
      status: true,
      massage: "user login successfully",
      data: userLogin,
      token: generateToken(userLogin.id),
    });
  } else {
    res.status(401);
    throw new Error("invalid credentials");
  }
});


module.exports = { updateProfile, loginUser, getAllUser };

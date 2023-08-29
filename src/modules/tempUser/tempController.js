const tempUser = require("../../modals/tempUserModal");
const RealUser = require("../../modals/userModal");
const User = require("../../modals/userModal");
const asyncHandler = require("express-async-handler");
const { generateOtp } = require("../../middlewere/otp");
const { generateToken } = require("../../middlewere/TokenMiddlewere");

const tempRegister = asyncHandler(async (req, res) => {
  const { email, mobileNumber } = req.body;

  if (!email && !mobileNumber) {
    res.status(400);
    throw new Error("Please fill email or mobileNumber");
  }

  const userExistByEmail = await RealUser.findOne({ email: email });
  const userExistByNumber = await RealUser.findOne({
    mobileNumber: mobileNumber,
  });

  if (userExistByEmail && userExistByNumber) {
    res.status(400);
    throw new Error("User already exist");
  }

  // const checkNumber = mobileNumber.length
  // console.log(checkNumber);

  const checkEmail = email.includes("@");

  if (checkEmail || mobileNumber) {
    //generate
    const tempOtp = Math.floor(Math.random() * (9800 - 1000 + 1) + 1000);
    const generatedOtp = tempOtp;

    // Sand otp
    const otp = await generateOtp(email, generatedOtp);

    // user create
    const user = await tempUser.create({
      email,
      mobileNumber,
      otp: generatedOtp,
    });

    if (user) {
      res.status(201).json({
        status: true,
        massage: "user created ",
        data: user,
      });
    } else {
      res.status(400);
      throw new Error("invalid user data");
    }
  } else {
    // res.status(400);
    throw new Error("Worng email or mobile number");
  }
});

// verifyOtp
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const tempEmail = await tempUser.findOne({ email: email });
  const dbotp = tempEmail?.otp;

  if (!email && !otp) {
    res.status(400);
    throw new Error("Please fill email or otp");
  }

  const checkEmail = email.includes("@");

  if (checkEmail) {
    if (otp == dbotp) {
      
        // user create
        const user = await User.create({
            email,
          });
      if (user) {
        res.status(201).json({
          status: true,
          massage: "user created ",
          data: user,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("invalid user data");
      }

    } else {
      res.status(400);
      throw new Error("woop, Wrong otp");
    }
  } else {
    // res.status(400);
    throw new Error("Worng email or mobile number");
  }
});






module.exports = { tempRegister, verifyOtp};

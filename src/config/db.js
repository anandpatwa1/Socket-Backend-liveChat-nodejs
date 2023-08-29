const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO_URI)
        // console.log(response.connection);
        console.log(`Database running`.rainbow);
    } catch (error) {
        console.log(error.message);
    }

}
module.exports = { connectDB }
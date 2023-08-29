const express = require("express");
const app = express();
const { connectDB } = require("./src/config/db");
const { errorHandler } = require("./src/middlewere/errorMiddlewere");
require("dotenv").config();
require("colours");

const cors = require("cors");
app.use(cors());

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const socketIO = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;
connectDB();

// Socket using

// set middlewere
app.use((req, res, next) => {
  req.io = socketIO;
  return next();
});

// Socket connection initialize
// socketIO.use((socket)=>{
// console.log("socket.handshake.query",socket.handshake.query);

// })

// Whenever someone connects this gets executed
socketIO.on("connection", async (socket) => {
  console.log("A user connected " + socket.id);
  // console.log(socket);

  socket.on("chat message", (message) => {
    console.log(`Message: ${'message'}`);
    io.emit("chat message", 'message'); // Broadcast the message to all connected clients
  });


  socket.on("send",(data) => {
    socket.broadcast.emit("receiver", 'data')
    // console.log(socket);
    // console.log(11111111);
    console.log(data);
    // socket.emit("chat", "hello");
    // socket.broadcast.emit("chat", "hello");
  });


  // socket.on("me", () => {
  //   socket.emit("me", "hello");
  // });

  //Whenever someone disconnects this piece of code executed
  // socket.on("disconnect", () => {
  //   console.log("A user disconnected");
  // });
});

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/otp", require("./src/modules/tempUser/tempRoutes"));
app.use("/api/user", require("./src/modules/user/userRoutes"));
app.use("/api/room", require("./src/modules/room/roomRoutes"));
app.use("/api/chat", require("./src/modules/chat/chatRouter"));
app.use("/api/task", require("./src/modules/task/taskRoute"));

app.get("/", (req, res) => {
  res.send("Wellcome to the Socket.io");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log("Your Socket.io PORT is runnung at " + PORT);
});

// app.listen(PORT, () => {
//   console.log("Your PORT is runnung at " + PORT);

// });

//__________________________________________________________________________

// -----------/ for new commit /-------------//

// go to AWS > login > EC2 > instance(running) > quoded (click in instance id) > (click on connect) > connect

// 'ls' show folder list
// 'cd "foldername"' go to folder
// 'cd ..' goback to folder

// quodedapi > qudedBE

// 2 'git pull "url"' from github
// 'pm2 ps' / 'pm2 l' show running servers list
// 'pm2 restart servername' ( servername =>  )

// restart server

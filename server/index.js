const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const connectToMongo = require("./db");
connectToMongo()
const fs = require("fs");
const express = require('express');
var cors = require('cors');
const {Server} = require("socket.io")
const app = express();
const http = require("http");
const multer = require("multer")
const mongoose = require("mongoose");
// const options = {
//   key: fs.readFileSync('../../Park.me/localhost-key.pem'),
//   cert: fs.readFileSync('../../Park.me/localhost-cert.pem')
// };
const server = http.createServer(app);
let gfsBucket;
const corsOptions = {
  origin: "http://localhost:5175",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5175",
    methods:["POST","GET","DELETE","PUT"],
    credentials:true
  }
})

io.on('connection',(socket)=>{
  console.log(`new user connected ${socket.id}`);
  socket.on('disconnect',()=>{
    console.log(`${socket.id} user disconnected`);
  })
})
app.set("socket", io);
app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Hello World!')

})
app.use("/auth",require("./routes/auth"));
app.use("/owner",require("./routes/owner"));
app.use("/status",require("./routes/book"));
app.use("/usr",require("./routes/user"));

mongoose.connection.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "PendinglocationImgs" });
  console.log("GridFSBucket initialized");
});

server.listen(3001, () => {
  console.log('Secure server running on http://127.0.0.1:3001');
});
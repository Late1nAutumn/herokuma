const express = require("express");
const bParser = require("body-parser");
const path = require("path");
const ioport = process.env.PORT || 3001;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.get("/test",(req,res)=>{res.status(200).send("test reached! :"+ioport)});

server.listen(ioport,()=>{console.log('\u001b[34mRTP up :'+ioport+'\u001b[0m');});

// const ctrl = require("./ctrl");
// app.get("/api", ctrl.get);

io.on('connection',(socket)=>{
  socket.on("test",(data)=>{console.log(data);})
});

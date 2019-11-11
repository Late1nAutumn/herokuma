const express = require("express");
const bParser = require("body-parser");
const path = require("path");
const ioport = process.env.PORT || 3000;

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.get("/test", (req, res) => {
  res.status(200).send({port:ioport,req:req});
  //check req if contains ip, for reconnection
});

server.listen(ioport, () => {
  console.log("\u001b[34mRTP up :" + ioport + "\u001b[0m");
});

module.exports = {
  io: io,
  app: app
};

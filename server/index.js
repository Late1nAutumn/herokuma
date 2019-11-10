const { io, app } = require("./init");
const Player = require("./class/player");
const Deck = require("./class/deck");

var players = [];
var roommates = [];
var deck = new Deck();
var gameStarted = false;

const roomInfo=(index)=>{
  var res=[];
  for(var i=0;i<roommates.length;i++)
    if(i===index)
      res.push({name:roommates[i].name,attend:roommates[i].attend});
  for(var i=0;i<roommates.length;i++)
    if(i!==index && roommates[i].attend==="play")
      res.push({name:roommates[i].name,attend:roommates[i].attend});
  for(var i=0;i<roommates.length;i++)
    if(i!==index && roommates[i].attend==="pend")
      res.push({name:roommates[i].name,attend:roommates[i].attend});
  for(var i=0;i<roommates.length;i++)
    if(i!==index && roommates[i].attend==="watch")
      res.push({name:roommates[i].name,attend:roommates[i].attend});
  return res;
};
// const initRoom = () => {
//   players = [];
//   deck = pack.slice();
// };
// initRoom();
io.on("connection", socket => {
  setInterval(() => {
    socket.emit("attendance","");
  }, 5000);
  //Todo: reconnection
});

app.put("/attendance",(req,res)=>{//triggered by E:attendance
  var i=req.body.index;
  if(roommates[i]){
    if(roommates[i].attend!=="pend")
      roommates[i].lastRes=(new Date()).getTime();
    else{
      if((new Date()).getTime()-roommates[i].lastRes>7000){
        roommates[i].attend="watch";
        socket.emit("roomupdate",roomInfo(i));
      }
    }
    res.status(202).send();
  }else{
    //error will happen when server restarted with a old client running
    res.status(400).send("user not registered");
  }
});

app.post("/namesubmit",(req,res)=>{//triggered by user submit
  //Todo: avoid spam name
  var temp = new Player(req.body.name);
  // temp.drawCard(deck.draw(10));
  temp.index=roommates.length.toString();
  roommates.push(temp);

  res.status(201).send({
    id: temp.id,
    index: temp.index,
    gaming: gameStarted,
    room: roomInfo(temp.index)
  });
});

app.put("/ready",(req,res)=>{
  //send room info
});
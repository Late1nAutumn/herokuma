const { io, app } = require("./init");
const Player = require("./class/player");
const Deck = require("./class/deck");

const log = (str,color)=>{
  console.log("\u001b["+color+"m"+str+"\u001b[0m");
};

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
setInterval(() => {
  // log("?aa",33);
  var now=(new Date()).getTime();
  for(var i of roommates){
    if(now-i.lastRes>8000 && i.attend==="pend"){
      i.attend="watch";
      i.socket.emit("clientState",{attend:"watch"});
      i.socket.emit("clientLog",["absence"]);

      log("broadcast: room update",32);
      io.sockets.emit("roomUpdate","");
    }
  }
}, 5000);

io.on("connection", socket => {//might be more efficiently done on 'connect'
  //Todo: avoid spam name

  var index=-1;
  log("new connection",33);
  // temp.drawCard(deck.draw(10));
  
  socket.on("nameSubmit",({name,id})=>{
    var temp = new Player(socket);
    temp.name = name;
    temp.id = id;
    index = roommates.length;
    temp.index = index.toString();
    roommates.push(temp);

    socket.emit("clientState",{ //must use the same key with client state
      index: temp.index,
      page: gameStarted?"play":"room"
    });
    socket.emit("clientLog",["roomInfo"]);

    log("broadcast: room update",32);
    io.sockets.emit("roomUpdate","");
  });

  socket.on("disconnect",()=>{
    //Todo: disconnect while gaming
    //Todo: reconnection
    log("user "+index+" disconnected",31);
    if(index!==-1){
      roommates[index]=roommates[roommates.length-1];
      roommates.pop();
      if(roommates[index])
        roommates[index].socket.emit("clientState",{index:index});
      log("broadcast: room update",32);
      io.sockets.emit("roomUpdate","");
    }
  });

  socket.on("getRoomInfo",(/*index*/)=>{ //triggered after S:roomUpdate
    socket.emit("clientState",{roommates: roomInfo(index)});
    socket.emit("clientLog",["roomInfo"]);
  });

  socket.on("ready",(status)=>{
    roommates[index].attend=status;
    roommates[index].lastRes=(new Date()).getTime();
    log("broadcast: room update",32);
    io.sockets.emit("roomUpdate","");
  })

});

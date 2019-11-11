const { io, app } = require("../init");
const Player = require("../class/player");

var roommates = [];
var gameStarted = false;

const log=(str,color)=>{
  console.log("\u001b["+color+"m"+str+"\u001b[0m");
};
const roomInfo=(index)=>{ //index should be number
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
const roomUpdate=(str)=>{
  log("broadcast: room update("+str+")",32);
  io.sockets.emit("roomUpdate","");
};
module.exports={
  log: log,
  attend: (time)=>{setInterval(() => {
    // log("?aa",33);
    var now=(new Date()).getTime();
    for(var i of roommates){
      if(now-i.lastRes>8000 && i.attend==="pend"){
        i.attend="watch";
        i.socket.emit("clientState",{attend:"watch"});
        i.socket.emit("clientLog",["absence"]);
        roomUpdate("afk");
      }
    }
  }, time)},
  nameSubmit: (socket,name,id)=>{
    var temp = new Player(socket);
    temp.name = name;
    temp.id = id;
    var index = roommates.length;
    temp.index = index.toString();
    roommates.push(temp);

    socket.emit("clientState",{ //must use the same key with client state
      index: temp.index,
      page: gameStarted?"play":"room"
    });
    socket.emit("clientLog",["roomInfo"]);
    roomUpdate("login");
    return index;
  },
  disconnect: (index)=>{
    log("user "+index+" disconnected",31);
    if(index!==-1){
      roommates[index]=roommates[roommates.length-1];
      roommates.pop();
      if(roommates[index]){ //avoid this being the last element
        roommates[index].socket.emit("moveIndex",index);
      }
      roomUpdate("dc");
    }
  },
  getRoomInfo: (socket,index)=>{
    socket.emit("clientState",{roommates: roomInfo(index)});
    socket.emit("clientLog",["roomInfo"]);
  },
  userReady: (status,index)=>{
    roommates[index].attend=status;
    roommates[index].lastRes=(new Date()).getTime();
    roomUpdate("ready");
  },
};
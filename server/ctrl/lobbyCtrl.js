const { io, app } = require("../init");
const Player = require("../class/player");
const config = require("../config");

var roommates = [];
var launchCounter = 0; //avoid multiple launch

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
const checkRoomState=(callback)=>{
  const startCheck=()=>{
    var sum=0;
    for(var i of roommates){
      if(i.attend==="pend")return false;
      if(i.attend==="play")sum++;
    }
    if(sum>=config.playerMin && sum<=config.playerMax)return true;
    return false;
  };
  if(startCheck()){
    launchCounter++;
    log("game start in 5",32);
    setTimeout(() => {
      launchCounter--;
      if(launchCounter===0)
        callback();
    }, 2000);
    return "countdown";
  }
  return "lfm";
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
  nameSubmit: (socket,name,id,gaming)=>{
    var temp = new Player(socket);
    temp.name = name;
    temp.id = id;
    var index = roommates.length;
    temp.index = index.toString();
    roommates.push(temp);

    socket.emit("clientState",{ //must use the same key with client state
      index: temp.index,
      page: gaming==="playing"?"desk":"room"
    });
    socket.emit("clientLog",["roomInfo"]);
    roomUpdate("login");
    return index;
  },
  userReady: (status,index,callback)=>{
    roommates[index].attend=status;
    roommates[index].lastRes=(new Date()).getTime();
    roomUpdate("ready");
    return checkRoomState(callback);
  },
  disconnect: (index,callback)=>{
    log("user "+index+" disconnected",31);
    io.sockets.emit("clientState",{page:"room"});
    if(index!==-1){
      roommates[index]=roommates[roommates.length-1];
      roommates.pop();
      if(roommates[index]){ //avoid this being the last element
        roommates[index].socket.emit("moveIndex",index);
      }
      roomUpdate("dc");
      return checkRoomState(callback);
    }
  },
  getRoomInfo: (socket,index)=>{
    socket.emit("clientState",{roommates: roomInfo(index)});
    socket.emit("clientLog",["roomInfo"]);
  },
  gameStarter: ()=>{
    var res=[];
    for(var i of roommates)
      if(i.attend==="play")
        res.push(i);

    var order=[]; //shuffle order
    for(var i=0;i<res.length;i++)order.push(i);
    for(var i of res){
      var n=Math.floor(Math.random()*res.length);
      i.order=order[n];
      order[n]=order.pop();
      i.hand=[];
    }
    for(var i=0;i<res.length-1;i++) //sort res by order
      for(var j=i+1;j<res.length;j++)
        if(res[i].order>res[j].order){
          var temp=res[j];
          res[j]=res[i];
          res[i]=temp;
        }
    for(var i=0;i<res.length;i++) //send order to roommates
      roommates[res[i].index].order=i;
    return res;
  },
  reset: (password)=>{
    if(password!==config.resetPassword)return;
    log("RESET ACTIVATED",31);
    io.sockets.emit("clientState",{page:"name"});
    roommates = [];
  }
};
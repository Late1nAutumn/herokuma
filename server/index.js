const { io, app } = require("./init");

const Deck = require("./class/deck");

const lobbyCtrl = require("./ctrl/lobbyCtrl");
const log = require("./ctrl/lobbyCtrl").log;

var players = [];
var deck = new Deck();

lobbyCtrl.attend(5000);

io.on("connection", socket => {//might be more efficiently done on 'connect'
  var index=-1;
  log("new connection",33);

  //Todo: avoid spam name

  socket.on("nameSubmit",({name,id})=>{
    index = lobbyCtrl.nameSubmit(socket,name,id);
  });

  socket.on("disconnect",()=>{
    //Todo: disconnect while gaming
    //Todo: reconnection
    lobbyCtrl.disconnect(index);
  });
  socket.on("updateIndex",(i)=>{ //triggered after S:disconnect
    index=i;
  });

  socket.on("getRoomInfo",(/*index*/)=>{ //triggered after S:roomUpdate
    lobbyCtrl.getRoomInfo(socket,index);
  });

  socket.on("userReady",(status)=>{ //triggered by client button
    lobbyCtrl.userReady(status,index);
  });

// socket.on("reset",()=>{
// const initRoom = () => {
//   players = [];
//   deck = pack.slice();
// };
// initRoom();});

  // temp.drawCard(deck.draw(10));
});

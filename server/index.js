const { io } = require("./init");

const lobbyCtrl = require("./ctrl/lobbyCtrl");
const desktopCtrl = require("./ctrl/desktopCtrl");

var gaming = "lfm"; //countdown, playing
var launchCounter = 0; //avoid multiple launch

const log = require("./ctrl/lobbyCtrl").log;
const gameStarter = () => {
  if (gaming === "countdown") {
    launchCounter++;
    log("game start in 3", 33);
    io.sockets.emit("countdown", "");
    setTimeout(() => {
      launchCounter--;
      if (gaming === "countdown" && launchCounter === 0) {
        gaming === "playing";
        desktopCtrl.gameStarter();
      }
    }, 3000);
  }
};

lobbyCtrl.attend(5000);

io.on("connection", socket => {
  //might be better using on 'connect'
  var index = -1;
  log("new connection", 33);

  //Todo: avoid spam name

  socket.on("nameSubmit", ({ name }) => {
    index = lobbyCtrl.nameSubmit(socket, name, gaming);
    //Todo:during gaming
  });

  socket.on("userReady", status => {
    //triggered by client button
    gaming = lobbyCtrl.userReady(status, index, () => {
      gameStarter();
    });
  });

  socket.on("disconnect", () => {
    //Todo: reconnection
    gaming = lobbyCtrl.disconnect(index, () => {
      gameStarter();
    });
  });
  socket.on("updateIndex", i => {
    //triggered after S:disconnect
    index = i; //this is an ugly move. parameter's change shouldn't rely on client
  });

  socket.on("getRoomInfo", (/*index*/) => {
    //triggered after S:roomUpdate
    lobbyCtrl.getRoomInfo(socket, index);
  });

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////

  var order = -1;
  socket.on("updateOrder", num => {
    //triggered after S:gameStart
    order = num;
  });

  socket.on("playCard", ({ i, card }) => {
    desktopCtrl.playCard(order, i, card);
  });

  socket.on("drawCard", n => {
    desktopCtrl.drawCard(order, n);
  });

  socket.on("reset", pw => {
    gaming = lobbyCtrl.reset(pw, gaming);
  });
});

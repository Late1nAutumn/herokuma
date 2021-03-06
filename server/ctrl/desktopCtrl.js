const { io } = require("../init");

const Deck = require("../class/deck");

const log = require("./lobbyCtrl").log;
const initPlayers = require("./lobbyCtrl").gameStarter;

var players = [];
var deck = null;
var history = []; //{card:str, player:name}
var playOrder = 0;
var playDirection = 1;

const deckInfo = () => {
  var data = []; //pluck player info
  for (var i of players) {
    data.push({
      name: i.name,
      remainHand: i.hand.length
    });
  }
  return {
    remainCard: deck.deck.length,
    players: data,
    history: history,
    playOrder: playOrder,
    playDirection: playDirection
  };
};
const pushOrder=(x)=>{
  if (players.length !== 1)
  //only happen in devmode
    playOrder =
      (playOrder + (x || 1) * playDirection + players.length) % players.length;
};
module.exports = {
  gameStarter: () => {
    players = initPlayers();
    deck = new Deck();
    history = [{ card: deck.draw(1)[0], player: "START" }];
    playOrder = Math.floor(Math.random() * players.length);
    playDirection = 1;
    log("GAME START", 31);
    for (var i of players) {
      i.drawCard(deck.draw(7));
      i.socket.emit("playerInit", {
        hand: i.hand,
        order: i.order
      });
    }
    //all roommates
    io.sockets.emit("gameStart", {
      ...{ page: "desk" },
      ...deckInfo()
    });
  },
  playCard: (order, i, card) => {
    log("player " + order + " plays a card", 32);

    var str = card.slice(card[0] === "w" ? 3 : 2);
    var burden = str === "" ? 0 : Number(str);
    str = history[0].card.slice(history[0].card[0] === "w" ? 3 : 2);
    burden += str === "" ? 0 : Number(str);
    burden = burden === 0 ? "" : burden.toString();

    deck.pile.push(card.slice(0, 2));
    history.unshift({
      card: card.slice(0, card[0] === "w" ? 3 : 2) + burden,
      player: players[order].name
    });
    history = history.slice(0, 5);
    players[order].hand.splice(i, 1);

    //win check
    if(players[order].hand.length===0){
      log("player " + order + " win", 31);
      io.sockets.emit("gameOver",order);
      //Todo: change all roommates attend to pend
      setTimeout(() => {
        io.sockets.emit("clientState",{
          page:"room",
          winPage:0
        });
      }, 5000);
    }

    if (card[1] === "r") playDirection = 0 - playDirection;
    pushOrder(card[1] === "s" ? 2 : 1);

    players[order].socket.emit("clientState", { hand: players[order].hand });
    io.sockets.emit("clientState", deckInfo());
  },
  drawCard: (order, n) => {
    log("player " + order + " draws "+ n +" card(s)", 32);

    if (order === -1) return;
    players[order].drawCard(deck.draw(n));
    if (n === 1) players[order].socket.emit("hotCard", players[order].hand);
    else {
      pushOrder(1);
      history[0].card = history[0].card.slice(
        0,
        history[0].card[0] === "w" ? 3 : 2
      );
      players[order].socket.emit("clientState", { hand: players[order].hand });
    }
    io.sockets.emit("clientState", deckInfo());
  },
  endTurn: ()=>{
    pushOrder(1);
    io.sockets.emit("clientState", { playOrder: playOrder });
  },
  disconnect: (order,gaming)=>{
    if(order===-1 || gaming!=="playing") return;
    for(var i of players[order].hand)
      deck.pile.push(i);
    players[order]=players[players.length-1];
    players.pop();
    if(players[order]) //avoid this being the last element
      players[order].socket.emit("moveOrder",order);
    if(order===playOrder)
      pushOrder(1);
    var obj=deckInfo();
    if(players.length===1)
      obj={...obj,...{page:"room"}};
    io.sockets.emit("clientState", obj);
  }
};

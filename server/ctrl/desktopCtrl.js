const { io, app } = require("../init");

const Deck = require("../class/deck");

const log = require("./lobbyCtrl").log;
const initPlayers = require("./lobbyCtrl").gameStarter;

var players = [];
var deck = null;
var history = []; //{card:str, player:name, extra:str (e.g. r12)}
var playOrder = 0;
var playDirection = 1;

const remainingHandData=()=>{
  var data=[]; //pluck player info
  for(var i of players){
    data.push({
      name: i.name,
      remainHand: i.hand.length
    });
  }
  return data;
};
const deckInfo=()=>{return{
  remainCard: deck.deck.length,
  players:remainingHandData(),
  history: history,
  playOrder: playOrder,
  playDirection: playDirection,
}};

module.exports={
  gameStarter:()=>{
    players=initPlayers();
    deck = new Deck();
    history = [{card:deck.draw(1)[0],player:"START"}];
    playOrder = Math.floor(Math.random()*players.length);
    playDirection = 1;
    log("GAME START",31);
    for(var i of players){
      i.drawCard(deck.draw(7));
      i.socket.emit("playerInit",{
        hand: i.hand,
        order: i.order
      });
    }
    io.sockets.emit("gameStart",{ //all roommates
      ...{page:"desk"},...deckInfo()
    });
  },
  playCard:(order,i,card,combo)=>{
    log("player "+order+" plays a card",32);
    deck.pile.push(card.slice(0,2));
    history.unshift({
      card:card,
      player:players[order].name
    });
    history=history.slice(0,5);
    players[order].hand.splice(i,1);
    //Todo: win check

    if(card[1]==="r")playDirection=0-playDirection;
    if(players.length!==1) //only happen in devmode
      playOrder=
        (playOrder+(card[1]==="s"?2:1) * playDirection+players.length)
        %players.length;

    players[order].socket.emit("clientState",{hand: players[order].hand});
    
    io.sockets.emit("clientState",deckInfo());
  },
  drawCard:(order,n)=>{
    if(order!==-1)  players[order].drawCard(deck.draw(n));
    players[order].socket.emit("clientState",{hand: players[order].hand});
    io.sockets.emit("clientState",{
      remainCard: deck.deck.length,
      players: remainingHandData()
    });
  },
};
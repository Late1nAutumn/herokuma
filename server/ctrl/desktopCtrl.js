const { io, app } = require("../init");

const Deck = require("../class/deck");

const log = require("./lobbyCtrl").log;
const initPlayers = require("./lobbyCtrl").gameStarter;

var players = [];
var deck = null;
var history = []; //{card:str, player:name}
var playOrder = 0;
var playDirection = 1;

module.exports={
  gameStarter:()=>{
    players=initPlayers();
    deck = new Deck();
    history = [{card:deck.draw(1)[0],player:"START"}]; //Todo: add a card as initial
    playOrder = 0;
    playDirection = 1;
    log("GAME START",31);
    var data=[];
    for(var i of players){
      i.drawCard(deck.draw(7));
      i.socket.emit("playerInit",{
        hand: i.hand,
        order: i.order
      });
      data.push({ //pluck player info
        name: i.name,
        remainHand: i.hand.length
      });
    }
    io.sockets.emit("gameStart",{ //all roommates
      page:"desk",
      remainCard: deck.deck.length,
      players: data,
      history: history, //Todo: last 5
      playOrder: 0,
      playDirection: 1,
    });
  },
  playCard:(order,i)=>{
    log("player "+order+" plays a card",32);
    var card=players[order].hand[i];
    deck.pile.push(card);
    history.unshift({
      card:card,
      player:players[order].name
    });
    history=history.slice(0,5);
    players[order].hand.splice(i,1);
    //Todo: win check

    if(card[1]==="r")playDirection=0-playDirection;
    if(players.length!==1) //only happen in devmode
      playOrder=(playOrder+(1+(card[1]==="s"?1:0))*playDirection)%players.length;

    var data=[];
    players[order].socket.emit("clientState",{hand: players[order].hand});
    for(var i of players){
      data.push({
        name: i.name,
        remainHand: i.hand.length
      });
    }
    io.sockets.emit("clientState",{
      remainCard: deck.deck.length,
      players: data,
      history: history,
      playOrder: playOrder,
      playDirection: playDirection,
    });
  },
  drawCard:(order,n)=>{
    if(order!==-1)  players[order].drawCard(deck.draw(n));
    players[order].socket.emit("clientState",{hand: players[order].hand});
    var data=[];
    for(var i of players){
      data.push({
        name: i.name,
        remainHand: i.hand.length
      });
    }
    io.sockets.emit("clientState",{
      remainCard: deck.deck.length,
      players: data
    });
  },
};
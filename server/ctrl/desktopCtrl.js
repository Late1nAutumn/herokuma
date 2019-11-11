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
    history = []; //Todo: add a card as initial
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
      players:data,
      history: [], //Todo: last 5
      playOrder: 0,
      playDirection: 1,
    });
  },
  drawCard:(order,n)=>{
    if(order!==-1)  player[order].drawCard(deck.draw(n));
  }
};
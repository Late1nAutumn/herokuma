import React from "react";
import ReactDOM from "react-dom";
import * as io from "socket.io-client";

import Lobby from "./lobby.jsx";
import Desktop from "./desktop.jsx";

const socket = io.connect(
  // "http://localhost:3000");
  "https://lateinautumn.herokuapp.com");

window.reset = pw => {
  socket.emit("reset", pw);
};
//Todo: fix any style bug by empty string (or space)
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "name", //room, desk
      //user info
      name: "",
      index: "",
      attend: "pend", //play, watch
      order: -1,
      hand: [],
      //room info
      roommates: [], //{name,attend}//Todo: show spectator names
      //desk info
      players: [], //{name,remainHand}
      remainCard: 108,
      history: [],
      playOrder: 0,
      playDirection: 1,
      //game state
      hotCard: false
    };
  }
  inputName(e) {
    this.setState({ name: e.target.value });
  }
  submitName() {
    if (this.state.name === "") this.setState({ name: "anonymous" });
    socket.emit("nameSubmit", { name: this.state.name || "anonymous" });

    socket.on("clientState", data => {
      this.setState(data);
    });
    socket.on("clientLog", operation => {
      //triggered with clientState
      if (operation[0] === "roomInfo")
        //triggered after S:roomUpdate & C:nameSubmit
        console.log("room info updated");
      if (operation[0] === "absence") console.log("you've been marked as afk");
    });

    socket.on("moveIndex", index => {
      //triggered when others disconnected, but this client is the last one on list
      this.setState({ index: index.toString() });
      socket.emit("updateIndex", index);
    });
    socket.on("roomUpdate", () => {
      //triggered when anyone dc,afk,ready,login
      socket.emit("getRoomInfo", this.state.index);
    });

    socket.on("countdown", () => {
      //Todo: countdown
    });

    socket.on("playerInit", data => {
      //triggered for player only
      console.log("player data loaded");
      this.setState(data);
      socket.emit("updateOrder", data.order);
    });
    socket.on("gameStart", data => {
      console.log("GAME START");
      this.setState(data);
    });

    socket.on("hotCard", hand => {
      this.setState({ hand: hand });
      var card = hand[hand.length - 1];
      if (card[0] !== "w" && !this.validPlay(card, "")) return;

      this.setState({ hotCard: true });
      setTimeout(() => {
        //Todo: countdown
        this.setState({ hotCard: false });
      }, 3000);
    });
  }
  submitReady() {
    var status = this.state.attend === "play" ? "pend" : "play";
    this.setState({ attend: status });
    socket.emit("userReady", status);
  }
  submitWatch() {
    var status = this.state.attend === "watch" ? "pend" : "watch";
    this.setState({ attend: status });
    socket.emit("userReady", status);
  }
  validPlay(hand, extra) {
    if (this.state.order !== this.state.playOrder) return false; //check if it is player's turn
    var target = this.state.history[0].card;
    var burden = target.slice(target[0] === "w" ? 3 : 2);
    //e.g. target will be like "wdr8" when burden exist
    var card = hand + extra;
    if (card[0] === "w" && extra === "") return false; //if wild cards didn't pick color
    if (hand === "wd") return true; //if +4
    if (burden !== "" && target[0] === "w" && card[0] !== target[2])
      return false; //+4 can't be followed by +2 in wrong color when need draw
    if (target[1] === card[1]) return true; //same number/property
    if (burden === "") {
      if (card[0] === "w") return true; //wild card
      if (target[target[0] === "w" ? 2 : 0] === card[0]) return true; //same color
    }
    return false;
  }
  playCard(i, extra) {
    if (this.validPlay(this.state.hand[i], extra)) {
      if (this.state.hotCard) this.setState({ hotCard: false });
      socket.emit("playCard", { i: i, card: this.state.hand[i] + extra });
    }
  }
  drawCard() {
    if (this.state.order !== this.state.playOrder) return;
    var target = this.state.history[0].card;
    var burden = target.slice(target[0] === "w" ? 3 : 2);
    socket.emit("drawCard", Number(burden) || 1);
  }
  componentDidMount() {
    var time = new Date().getTime();
    console.log("App loading time:" + (time - window.startTime) + "ms");
  }
  render() {
    return (
      <div className="content">
        {this.state.hotCard ? <div className="modal" /> : <div />}
        <div className="nav">
          {this.state.page === "name" ? (
            <div>
              Hello <br />
              <input
                id="nameinput"
                placeholder="your name please"
                onChange={this.inputName.bind(this)}
                value={this.state.name}
              />
              <button onClick={this.submitName.bind(this)}>submit</button>
            </div>
          ) : (
            <div>
              <br />
              {this.state.name}
            </div>
          )}
          {/* <div id="memberCount">{"<0> 8"}</div> */}
        </div>

        {this.state.page !== "room" ? (
          <div />
        ) : (
          <Lobby
            data={this.state.roommates}
            ready={this.submitReady.bind(this)}
            watch={this.submitWatch.bind(this)}
          />
        )}

        {this.state.page !== "desk" ? (
          <div />
        ) : (
          <Desktop
            players={this.state.players}
            remainCard={this.state.remainCard}
            history={this.state.history}
            playOrder={this.state.playOrder}
            playDirection={this.state.playDirection}
            hotCard={this.state.hotCard}
            order={this.state.order}
            hand={this.state.hand}
            playCard={this.playCard.bind(this)}
            drawCard={this.drawCard.bind(this)}
          />
        )}

        <div id="chat"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

import React from "react";
class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="lobbyList">
          {(() => {
            var arr = this.props.data;
            while (arr.length < 12) arr.push({});
            return arr.map((obj, i) => {
              var classname = i % 2 === 0 ? "lobbyItem0" : "lobbyItem1";
              var status = "";
              if (obj.attend === "play") {
                status = "ready";
                classname = "lobbyItemReady";
              }
              if (obj.attend === "watch") status = "spectator";
              return (
                <div className={classname}>
                  <div className="clientName">{obj.name}</div>
                  <div className="clientAttend">{status}</div>
                </div>
              );
            });
          })()}
        </div>
        <div
          id="readyButton"
          className="lobbyButton"
          onClick={()=>{this.props.ready("play")}}
        >
          <p>Ready</p>
        </div>
        <div
          id="watchButton"
          className="lobbyButton"
          onClick={()=>{this.props.ready("watch")}}
        >
          <p>Spectate</p>
        </div>
      </div>
    );
  }
}
export default Lobby;

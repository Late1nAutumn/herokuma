import React from "react";
import ReactDOM from "react-dom";
import * as io from 'socket.io-client';
import axios from "axios";

import Lobby from "./lobby.jsx";

const DEVMODE = true;
const URL = DEVMODE
  ?"http://localhost:3001"
  :"https://lateinautumn.herokuapp.com";
const socket = io.connect(URL);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "name", //room, play
      //user info
      name:"", id:"", index:"",
      attend:"pend", //play, watch
      //room info
      roommates:[], //Todo: show roommate names
      players:[]
    };
  }
  inputName(e){this.setState({name:e.target.value})}
  submitName(){
    if(this.state.name==="")this.setState({name:"anonymous"});
    socket.emit("nameSubmit",{
      name:this.state.name||"anonymous",
      id:this.state.id
    });
  }
  submitReady(){
    var status=this.state.attend==="play"?"pend":"play";
    this.setState({attend:status});
    socket.emit("userReady",status);
  }
  submitWatch(){
    var status=this.state.attend==="watch"?"pend":"watch";
    this.setState({attend:status});
    socket.emit("userReady",status);
  }
  componentDidMount() {
    this.setState({id:Math.floor(Math.random()*63365).toString()});
    var time=(new Date()).getTime();
    console.log("App loading time:"+(time-window.startTime)+"ms");

    socket.on("clientState",(data)=>{this.setState(data);});
    socket.on("clientLog",(operation)=>{ //triggered with clientState
      if(operation[0]==="roomInfo") //triggered after S:roomUpdate & C:nameSubmit
        console.log("room info updated");
      if(operation[0]==="absence")
        console.log("you've been marked as afk");
    });
  
    socket.on("moveIndex",(index)=>{ //triggered when others disconnected, but this client is the last one on list
      this.setState({index:index.toString()});
      socket.emit("updateIndex",index);
    });
    socket.on("roomUpdate",()=>{ //triggered when anyone dc,afk,ready,login
      socket.emit("getRoomInfo",this.state.index);
    });

  }
  render() {
    return (
      <div className = "content" >
        <div className = "nav">
          {this.state.page==="name"?
          <div>
            Hello <br/>
            <input id="nameinput" placeholder="your name please"
              onChange={this.inputName.bind(this)}
              value={this.state.name}/>
            <button onClick={this.submitName.bind(this)}>submit</button>
          </div>:<div><br/>{this.state.name}</div>}
          {/* <div id="memberCount">{"<0> 8"}</div> */}
        </div>
        {this.state.page!=="room"?<div/>:<Lobby
          data={this.state.roommates}
          ready={this.submitReady.bind(this)}
          watch={this.submitWatch.bind(this)}/>}
        {this.state.page==="play"?<div></div>:<div/>}
        <div id="chat"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

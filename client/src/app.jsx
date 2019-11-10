import React from "react";
import ReactDOM from "react-dom";
import * as io from 'socket.io-client';
import axios from "axios";
const DEVMODE = true;
const URL = DEVMODE
  ?"http://localhost:3001"
  :"https://lateinautumn.herokuapp.com";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "name", //room, play
      nameInput:"",
      //user info
      name:"", id:"", index:"",
      attend:"pend", //play, watch
      //room info
      roommates:[], //Todo: show roommate names
      players:[]
    };
  }
  inputName(e){this.setState({nameInput:e.target.value})}
  submitName(){
    var name=this.state.nameInput;
    axios.post(URL+"/namesubmit",{name:name||"anonymous"})
      .then(({data})=>{
        // console.log(data);
        console.log("fetched userid:"+data.id);

        var socket = io(URL);
        socket.on("connect",()=>{
    
          socket.on("attendance",()=>{//triggered per 5s
            axios.put(URL+"/attendance",{//report attend status
              attend:this.state.attend,
              id:this.state.id,
              index:this.state.index
            }).then(null,(err)=>{console.log(err)});
            //show disconnection if more than 5s
          });

          socket.on("roomupdate",(roomInfo)=>{//triggered when anyone afk
            this.setState({roommates:roomInfo});
          })
        });

        this.setState({
          page: data.gaming?"play":"room",
          roommates: data.room,

          name: name,
          id: data.id,
          index: data.index
        })
      },(err)=>{console.log(err)});
  }
  componentDidMount() {
    var time=(new Date()).getTime();
    console.log("App loading time:"+(time-window.startTime)+"ms");
  }
  render() {
    return (
      <div id = "content" >
        <div id="nav">
          {this.state.page==="name"?
          <div>
            Hello <br/>
            <input id="nameinput" placeholder="your name please"
              onChange={this.inputName.bind(this)}
              value={this.state.nameInput}/>
            <button onClick={this.submitName.bind(this)}>submit</button>
          </div>:<div><br/>{this.state.name}</div>}
          <div id="memberCount">{"<0> 8"}</div>
        </div>
        {this.state.page==="room"?<div></div>:<div/>}
        {this.state.page==="play"?<div></div>:<div/>}
        <div id="chat"></div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

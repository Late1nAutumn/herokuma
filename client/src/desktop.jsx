import React from "react";
class Desktop extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }
  render(){return(<div>
    <div>
      <div className="deskStatus">{"Cards in deck: "+this.props.remainCard}</div>
      <div className="deskStatus">{"Now playing from "+(this.props.playDirection>0?"LEFT":"RIGHT")
        +" to "+(this.props.playDirection<0?"LEFT":"RIGHT")}</div>
    </div>

    <div>{(()=>{
      var temp=[];
      var i=(this.props.order+1)%this.props.players.length;
      while(i!==this.props.order){
        temp.push(i);
        i=(i+1)%this.props.players.length;
      }
      return temp.map((i)=>(
        <div className="playerIdol">
          <div className="playerText">{this.props.players[i].name}</div>
          <div className="playerText">{"cards: "+this.props.players[i].remainHand}</div>
        </div>
      ))
    })()}</div>

    <div>
      {this.props.history.map((obj,i)=>(
        <div>
          <div className={i===0?"lastHistory":"historyCard"}>{obj.card}</div>
          <div>{obj.player}</div>
        </div>
      ))}
    </div>

    <div>
      <div className="buttonBox">
        <div className="interfaceButton">Draw</div>
        <div className="interfaceButton">notice</div>
      </div>
      {this.props.hand.map((str)=>(
        <div className="handCard">{str}</div>
      ))}
    </div>
  </div>)}
};
export default Desktop;
import React from "react";
class Desktop extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }
  cardColorClass(str){
    if(str[0]==='w')return " wildCard";
    if(str[0]==='b')return " blueCard";
    if(str[0]==='r')return " redCard";
    if(str[0]==='g')return " greenCard";
    if(str[0]==='y')return " yellowCard";
  }
  cardName(str){
    if(str==='wd')return "+4";
    if(str==='wc')return "wild";
    if(str[1]==='d')return "+2";
    if(str[1]==='s')return "skip";
    if(str[1]==='r')return "reve\nrse";
    return str[1];
  }
  render(){return(<div className="desktop">
    <div>
      <div className="deskStatus">{"Cards in deck: "+this.props.remainCard}</div>
      <div className="deskStatus">{"Now playing from "+(this.props.playDirection>0?"LEFT":"RIGHT")
        +" to "+(this.props.playDirection<0?"LEFT":"RIGHT")}</div>
    </div>

    <div>{(()=>{
      var temp=[];
      //using while loop here might lead to dead loop, don't do it
      for(var i=this.props.order+1;i<this.props.players.length;i++)temp.push(i);
      for(var i=0;i<this.props.order;i++) temp.push(i);
      return temp.map((i)=>(
        <div className={this.props.playOrder===i?"playerIdolPlaying":"playerIdol"}>
          <div className="playerText">{this.props.players[i].name}</div>
          <div className="playerText">{"cards: "+this.props.players[i].remainHand}</div>
        </div>
      ))
    })()}</div>

    <div className="history">
      {this.props.history.map((obj,i)=>(
        <div className="historyCardContainer">
          <div className={(i===0?"lastHistory":"historyCard")
            +this.cardColorClass(obj.card)}>
            {this.cardName(obj.card)}
          </div>
          <div>{obj.player}</div>
        </div>
      ))}
    </div>

    <div className={this.props.order===this.props.playOrder?"handPlaying":"hand"}>
      <div className="buttonBox">
        <div className="interfaceButton"
          onClick={()=>{this.props.drawCard(1)}}>Draw</div>
        <div className="interfaceButton">uno</div>
      </div>
      {this.props.hand.map((str,i)=>(
        <div className={"handCard"+this.cardColorClass(str)}
          onClick={()=>{this.props.playCard(i)}}>
          {this.cardName(str)}
        </div>
      ))}
    </div>
  </div>)}
};
export default Desktop;
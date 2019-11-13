import React from "react";
class Desktop extends React.Component{
  constructor(props){
    super(props);
    this.state={};
  }
  cardColorClass(str){
    const color=(ch)=>{
      if(ch==='b')return " blueCard";
      if(ch==='r')return " redCard";
      if(ch==='g')return " greenCard";
      if(ch==='y')return " yellowCard";
      return " wildCard";
    };
    if(str[0]==='w')return color(str[2]);
    return color(str[0]);
  }
  cardName(str){
    if(str.slice(0,2)==='wd')return "+4";
    if(str.slice(0,2)==='wc')return "wild";
    if(str[1]==='d')return "+2";
    if(str[1]==='s')return "skip";
    if(str[1]==='r')return "reve\nrse";
    return str[1];
  }
  render(){return(<div className="desktop">
    <div>
      <div className="deskStatus">{"Cards in deck: "+this.props.remainCard}</div>
      <div className="orderArrow">{[1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(()=>(
        this.props.playDirection>0?"⇨ ":"⇦ "))}</div>
    </div>

    <div className="opponents">{(()=>{
      var temp=[];
      //using while loop here might lead to dead loop, don't do it
      for(var i=this.props.order+1;i<this.props.players.length;i++) temp.push(i);
      for(var i=0;i<this.props.order;i++) temp.push(i);

      return temp.map((i)=>(
        <div className={this.props.playOrder===i?"opponentIdolPlaying":"opponentIdol"}>
          <div className="opponentOrder"><b>{i+1}</b></div>
          <div className="opponentText">{this.props.players[i].name}</div>
          <div className="opponentText">
            cards:&nbsp;<b>{this.props.players[i].remainHand}</b>
          </div>
        </div>
      ))
    })()}</div>

    <div className="history">
      {/* Todo: show extra info */}
      {this.props.history.map((obj,i)=>(
        <div className="historyCardContainer">
          <div className={(i===0?"lastHistory":"historyCard")
            +this.cardColorClass(obj.card)}>
            {this.cardName(obj.card)}
          </div>
          <div className="historyPlayer">{obj.player}</div>
        </div>
      ))}
    </div>

    <div className={this.props.order===this.props.playOrder?"handPlaying":"hand"}>
      <div className="buttonBox">
        <div className="interfaceButton"
          onClick={this.props.drawCard}>Draw</div>
        <div className="interfaceButton">uno</div>
      </div>
      {this.props.hand.map((str,i)=>(
        // Todo: wild card color picking
        // Todo: combo card modal
        <div className={"handCard"+this.cardColorClass(str)+
          ((this.props.hotCard && i+1===this.props.hand.length)?" hotCard":"")}
          onClick={()=>{this.props.playCard(i,
            (str[0]!=="w" && str[1]==="d")?"2":"",false)}}>
          {this.cardName(str)}
          {str[0]!=="w"?<div/>:<div className="wildRed"
            onClick={()=>{this.props.playCard(i,"r"+(str[1]==="d"?"4":""),false)}}/>}
          {str[0]!=="w"?<div/>:<div className="wildBlue"
            onClick={()=>{this.props.playCard(i,"b"+(str[1]==="d"?"4":""),false)}}/>}
          {str[0]!=="w"?<div/>:<div className="wildYellow"
            onClick={()=>{this.props.playCard(i,"y"+(str[1]==="d"?"4":""),false)}}/>}
          {str[0]!=="w"?<div/>:<div className="wildGreen"
            onClick={()=>{this.props.playCard(i,"g"+(str[1]==="d"?"4":""),false)}}/>}
        </div>
      ))}
    </div>
  </div>)}
};
export default Desktop;
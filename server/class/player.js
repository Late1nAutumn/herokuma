class player{
  constructor(nameInput){
    this.name=nameInput;
    this.id=Math.floor(Math.random()*63365).toString();
    this.index=undefined;//as roommate

    this.attend="pend"; //play, watch
    this.lastRes=(new Date()).getTime();//can we set this number smaller?
    //ip adress?
    this.hand=[];
  }
  drawCard(arr){
    arr.map((str)=>{this.hand.push(str)})
  }
};

module.exports=player;
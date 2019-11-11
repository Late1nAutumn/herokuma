class player{
  constructor(socket){
    this.socket=socket;
    this.name="anonymous";
    this.id="";
    this.index=undefined;//as roommate

    this.attend="pend"; //play, watch
    this.lastRes=(new Date()).getTime();//can we set this number smaller?
    // this.online=true;
    //ip adress?
    this.order=undefined; //not updated in roommates
    this.hand=[]; //not updated in roommates
  }
  drawCard(arr){
    arr.map((str)=>{this.hand.push(str)})
  }
};

module.exports=player;
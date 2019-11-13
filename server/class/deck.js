class deck{
  constructor(rule){
    this.deck=[ //draw, reverse, skip
      'r1','r2','r3','r4','r5','r6','r7','r8','r9','rd','rr','rs',
      'r1','r2','r3','r4','r5','r6','r7','r8','r9','rd','rr','rs',
      'b1','b2','b3','b4','b5','b6','b7','b8','b9','bd','br','bs',
      'b1','b2','b3','b4','b5','b6','b7','b8','b9','bd','br','bs',
      'y1','y2','y3','y4','y5','y6','y7','y8','y9','yd','yr','ys',
      'y1','y2','y3','y4','y5','y6','y7','y8','y9','yd','yr','ys',
      'g1','g2','g3','g4','g5','g6','g7','g8','g9','gd','gr','gs',
      'g1','g2','g3','g4','g5','g6','g7','g8','g9','gd','gr','gs',
      'r0','b0','y0','g0','wd','wd','wd','wd','wc','wc','wc','wc'];
    this.pile=[];
  }
  draw(n){
    var res=[];
    for(var i=0;i<n;i++){
      var card = Math.floor(Math.random()*this.deck.length);
      res.push(this.deck[card]);
      if(this.deck.length===1){
        this.deck=this.pile;
        this.pile=[];
        //edge case bug: if all cards are in players' hand
      }
      else this.deck[card]=this.deck.pop();//o(1) to set array
    }
    return res;
  }
};

module.exports=deck;
class deck{
  constructor(rule){
    this.deck=[ //draw, reverse, skip
      'r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','rd','rr','rs',
           'r1','r2','r3','r4','r5','r6','r7','r8','r9','rd','rr','rs',
      'b0','b1','b2','b3','b4','b5','b6','b7','b8','b9','bd','br','bs',
           'b1','b2','b3','b4','b5','b6','b7','b8','b9','bd','br','bs',
      'y0','y1','y2','y3','y4','y5','y6','y7','y8','y9','yd','yr','ys',
           'y1','y2','y3','y4','y5','y6','y7','y8','y9','yd','yr','ys',
      'g0','g1','g2','g3','g4','g5','g6','g7','g8','g9','gd','gr','gs',
           'g1','g2','g3','g4','g5','g6','g7','g8','g9','gd','gr','gs',
      'wd','wd','wd','wd','wc','wc','wc','wc']; //wdg, wcb
    this.pile=[];
  }
  draw(n){
    var res=[];
    for(var i=0;i<n;i++){
      var card = Math.floor(Math.random()*this.deck.length);
      res.push(this.deck[card]);
      this.deck[card]=this.deck.pop();//o(1) to set array

      if(!this.deck[0]){
        this.deck=this.pile;
        this.pile=[];
      }
      //edge case bug: if all cards are in players' hand
    }
    return res;
  }
};

module.exports=deck;
class deck{
  constructor(rule){
    this.deck=[
      'r0','r1','r2','r3','r4','r5','r6','r7','r8','r9','ri','rr','rs',
           'r1','r2','r3','r4','r5','r6','r7','r8','r9','ri','rr','rs',
      'b0','b1','b2','b3','b4','b5','b6','b7','b8','b9','bi','br','bs',
           'b1','b2','b3','b4','b5','b6','b7','b8','b9','bi','br','bs',
      'y0','y1','y2','y3','y4','y5','y6','y7','y8','y9','yi','yr','ys',
           'y1','y2','y3','y4','y5','y6','y7','y8','y9','yi','yr','ys',
      'g0','g1','g2','g3','g4','g5','g6','g7','g8','g9','gi','gr','gs',
           'g1','g2','g3','g4','g5','g6','g7','g8','g9','gi','gr','gs',
      'w4','w4','w4','w4','wc','wc','wc','wc'];
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
  play(str){
    this.pile.push(str);
  }
};

module.exports=deck;
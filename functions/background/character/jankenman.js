module.exports = (keyword)=>{
  var hand = ["グー", "チョキ", "パー"];
  hand.sort((a,b)=>Math.random()-0.5);
  return hand[0];
}

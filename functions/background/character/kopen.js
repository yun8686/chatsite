module.exports = (words)=>{
  var answer = "難しいことは分からないんだよ～。";
  console.log(words);
  var analysis = {
    words: words.map((word, i)=>{return {pos: word.pos[0], surface: word.surface[0], i}}),
    noun: [],  // 名詞
    verb: [],  // 動詞
    auxverb: [],  // 助動詞
  };
  analysis.words.forEach((v, i)=>{
    const pos = v.pos;
    const surface = v.surface;
    switch(pos){
      case "名詞":
        analysis.noun.push({surface, i});
        break;
      case "動詞":
        analysis.verb.push({surface, i});
        break;
      case "助動詞":
        analysis.auxverb.push({surface, i});
        break;
    }
  });
  var talkLists = [{answer, score:-10000}];
  talkLists = talkLists.concat(
    // 名詞パターン
    analysis.noun.map(v=>{
      var answer, score;
      switch(v.surface){
        case "会社":
        case "出勤":
          answer = companyPtn(analysis);
          score=50;
          break;
        case "仕事":
          answer = jobPtn(analysis);
          score=50;
          break;
      }
      return {answer, score};
    }),
    // 助動詞パターン
    analysis.auxverb.map(v=>{
      var answer, score;
      switch(v.surface){
        case "ない":
          answer = nothingPtn(analysis);
          score=100;
          break;
      }
      return {answer, score};
    })
  );
  console.log(talkLists);
  var answer = talkLists.sort((a,b)=>b.score-a.score)[0].answer;
  console.log(answer);
  console.log(words.map((word)=>{
    return word.surface[0] + `(${word.pos[0]})`;
  }).join(" "));
  return talkLists.sort((a,b)=>b.score-a.score)[0].answer;
};


// 会社パターン
function companyPtn(analysis){
  var answer = "出勤してえらい！";

  return answer;
}
// 仕事パターン
function jobPtn(analysis){
  var answer = "今日は職場に着いた時点で、満点なんだよ～";
  return answer;
}


// 助動詞
// ～ないパターン
function nothingPtn(analysis){
  var answer = "いつも頑張ってるの　見てるよ";
  return answer;
}

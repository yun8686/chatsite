const webclient = require("request");
const xml2js = require("xml2js");
module.exports = (sentence, callback)=>{
  webclient.get({
    url: "https://jlp.yahooapis.jp/MAService/V1/parse",
    qs: {
      appid: "dj00aiZpPUtQWWlZVkFNYjZpZyZzPWNvbnN1bWVyc2VjcmV0Jng9MjY-",
      results: "ma,uniq",
      sentence: sentence,
    }
  }, (error, response, body)=>{
    if(error) callback(error, response, body);
    else{
      xml2js.parseString(body, (error, result)=>{
        callback(error, response, result);
      });
    }
  });

}

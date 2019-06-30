const chatdata = [
  {
    roomId: "waiwai1", roomname: "ワイワイチャット1",
    messages:[
      {author: "aaa", message: "こんにちは"},
      {author: "bbb", message: "こんにちは"},
      {author: "aaa", message: "おはよう"},
      {author: "ccc", message: "よろしく"},
      {author: "bbb", message: "ありがとう"},
    ],
  },
  {roomId: "waiwai2", roomname: "ワイワイチャット2"},
  {roomId: "waiwai3", roomname: "ワイワイチャット3"},
];

let searchChatroom = function({roomname}){
  return new Promise(
    (resolve, reject)=>{resolve({data: chatdata});}
  );
}

let getMessage = function({roomId}){
  const chat = chatdata.find(v=>v.roomId==roomId);
  const messages = chat?chat.messages:[];
  return new Promise(
    (resolve, reject)=>{resolve({data: messages});}
  );
}

export default {
  searchChatroom,
  getMessage,
};

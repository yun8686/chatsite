// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fireStore = admin.firestore();
const firestore = functions.firestore;

const roomRef = fireStore.collection('chats');
//const keitaiso = require('./api/yahoo');
const jankenman = require('./character/jankenman');

//const chatRef = firestore.

module.exports = firestore
.document('/chats/{roomid}/messages/{messageid}')
.onCreate((snapshot, context)=>{
  const data = snapshot.data();
  console.log("---------------- chat received ----------------", data.author);
  if(data.author){
    const roomid = context.params.roomid;
    const messageid = context.params.messageid;
    data.message;
    console.log("---------------- chat authord ----------------");
    const botMessage = runBot(data.message);
    if(botMessage && botMessage.length > 0){
      roomRef.doc(roomid).collection('messages').add({"author": null, "message": botMessage, "createdAt": new Date()});
    }
  }
  return true;
});


function runBot(keyword){
  var answer = "";
  switch(keyword){
    case "じゃんけん":
      answer = jankenman(keyword);
      break;
  }
  return answer;
}

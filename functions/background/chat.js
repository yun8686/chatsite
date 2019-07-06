// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fireStore = admin.firestore();
const firestore = functions.firestore;

const roomRef = fireStore.collection('chats');
//const keitaiso = require('./api/yahoo');
//const kopen = require('./character/kopen');

//const chatRef = firestore.

module.exports = firestore
.document('/chats/{roomid}/messages/{messageid}')
.onCreate((snapshot, context)=>{
  const data = snapshot.data();
  console.log("---------------- chat received ----------------", data.author);
  if(data.author){
    const roomid = context.params.roomid;
    const messageid = context.params.messageid;
    console.log("---------------- chat authord ----------------");
    roomRef.doc(roomid).collection('messages').add({"author": null, "message": "返信マン!", "createdAt": new Date()});
    //runBot();
  }
  return true;
});


function runBot(){
  keitaiso(data.message, (error, response, body)=>{
    const words = body.ResultSet.ma_result[0].word_list[0].word;
    var message;
    try{
      message = kopen(words);
    }catch(e){
      console.log("-------------error---------------")
      console.log(e);
    }
    roomRef.doc(roomid).collection('messages').add({"author": null, "message": message, "createdAt": new Date()});
  });
}

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fireStore = admin.firestore();
const firestore = functions.firestore;

const roomRef = fireStore.collection('chats');

module.exports = firestore
.document('/chats/{roomid}/members/{memberid}')
.onDelete((snapshot, context)=>{
  // チャットメンバー更新時の処理
  const userdata = snapshot.data();
  const roomid = context.params.roomid;
  roomRef.doc(roomid).collection('messages').add({"author": null, "message": userdata.name+"さんが退室しました", "createdAt": new Date()});
  return true;
});

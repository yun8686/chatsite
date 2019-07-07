// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fireStore = admin.firestore();
const firestore = functions.firestore;

module.exports = firestore
.document('/chats/{roomid}/members/{memberid}')
.onCreate((snapshot, context)=>{
  // チャットメンバー更新時の処理
  const data = snapshot.data();

  return true;
});

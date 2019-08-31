// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const fireStore = admin.firestore();
const firestore = functions.firestore;

const roomRef = fireStore.collection('chats');
const chatOptionRef = fireStore.collection('chat_options');

const FieldValue = admin.firestore.FieldValue;

const onDelete = firestore
.document('/chats/{roomid}/members/{memberid}')
.onDelete((snapshot, context)=>{
  // チャットメンバー削除時の処理
  const userdata = snapshot.data();
  const roomid = context.params.roomid;
  chatOptionRef.doc(roomid).get().then(chatOption=>{
    roomRef.doc(roomid).collection('messages').add({
      "author": null,
      "message": chatOption.data().exit_message.replace(/\$\{author\}/g, userdata.name),
      "createdAt": new Date()
    });
  });
  roomRef.doc(roomid).update({nowmember: FieldValue.increment(-1)});

  return true;
});

const onCreate = firestore
.document('/chats/{roomid}/members/{memberid}')
.onCreate((snapshot, context)=>{
  // チャットメンバー作成時の処理
  const userdata = snapshot.data();
  const roomid = context.params.roomid;
  chatOptionRef.doc(roomid).get().then(chatOption=>{
    roomRef.doc(roomid).collection('messages').add({
      "author": null,
      "message": chatOption.data().welcome_message.replace(/\$\{author\}/g, userdata.name),
      "createdAt": new Date()
    });
  });
  roomRef.doc(roomid).update({nowmember: FieldValue.increment(1)});

  return true;
});

module.exports = {
  onCreate: onCreate,
  onDelete: onDelete,
}

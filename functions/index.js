 const functions = require('firebase-functions');
 const admin = require('firebase-admin');
 admin.initializeApp(functions.config().firebase);

// chats/{roomid}/messages/{messageid}
exports.chatProcess = require('./background/chat.js');

// chats/{roomid}/messages/{members}
exports.memberProcess = require('./background/members.js');

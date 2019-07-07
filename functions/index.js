 const functions = require('firebase-functions');
 const admin = require('firebase-admin');
 admin.initializeApp(functions.config().firebase);

 exports.chatProcess = require('./background/chat.js');

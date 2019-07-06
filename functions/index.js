 const functions = require('firebase-functions');
 const express = require('express');
 const path = require('path');

 const app = express();

 const admin = require('firebase-admin');
 admin.initializeApp(functions.config().firebase);


 const indexRouter = require('./routes/index');
 const roomsRouter = require('./routes/rooms');

 app.use(express.json());
 app.use(express.urlencoded({ extended: false }));
 app.use(express.static(path.join(__dirname, 'routes')));


 app.use('/api', indexRouter);
 app.use('/api/room', roomsRouter);

 exports.api = functions.https.onRequest(app);
 exports.chatProcess = require('./background/chat.js');

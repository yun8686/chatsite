const express = require('express');
const router = express.Router();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fireStore = admin.firestore();

const Room = require('../model/room');

/* GET home page. */
router.get('/search', async (req, res, next)=>{
  const roomname = req.query.r;
  try{
    const results = await Room.searchRoom({roomname});
    res.json(results);
  }catch(e){
    res.json({"eror": true,
      "mes": e.message,
    });
  }
});

router.post('/', async (req, res, next)=>{
  const roomname = req.body.roomname;
  await Room.createRoom(req.body);
  res.json({
    title: 'Room Posted' ,
  });
});

module.exports = router;

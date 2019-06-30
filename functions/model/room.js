const admin = require('firebase-admin');

const uuid = require('node-uuid');
const fireStore = admin.firestore();

const roomRef = fireStore.collection('rooms');

const roomColumns = [
  {name: "roomId", listdata:true},
  {name: "roomname", listdata:true},
  {name: "maxmember", listdata:true},
  {name: "email"},
  {name: "creator_id"},
  {name: "creator_pw"},
  {name: "is_private"},
];
module.exports = {
  createRoom,
  searchRoom,
};

class Room{
  constructor(obj){
    roomColumns.forEach(column=>{
      this[column.name] = obj[column.name]!==undefined?obj[column.name]:null;
    });
  }
  getAllData(){
    const data = {};
    roomColumns.forEach(column=>{
      data[column.name] = this[column.name];
    });
    return data;
  }

  // 検索結果のリストに表示する項目だけ取得
  getListData(){
    const data = {};
    roomColumns.filter(column=>column.listdata)
    .forEach(column=>{
      data[column.name] = this[column.name];
    });
    return data;
  }
}

async function createRoom({
  roomname, email, creator_id, creator_pw, is_private, maxmember
}){
  const roomId = uuid.v4();
  const room = new Room({
    roomId, roomname, email, creator_id, creator_pw,
    is_private, maxmember,
  });
  if(is_private === "true" || is_private === true){
    await roomRef.doc("private").collection('rooms').doc(roomId).set(room.getAllData());
  }else{
    await roomRef.doc("public").collection('rooms').doc(roomId).set(room.getAllData());
  }
}

async function searchRoom({roomname}){
  const rooms = [];
  (await roomRef.doc("public").collection('rooms').get())
  .forEach(v=>{
    rooms.push(new Room(v.data()).getListData());
  });
  return rooms;
}

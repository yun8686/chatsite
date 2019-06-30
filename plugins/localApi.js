const axios = require('axios');

// チャットルーム検索機能
let searchChatroom = function({roomname}){
  return axios.get('/api/room/search', {roomname});
}

export default {
  searchChatroom,
};

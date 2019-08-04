<template>
  <v-app id="chat/room">
    <v-container fluid grid-list-xl>
      <v-layout row>
        <v-flex xl8>
          <header class="header" v-if="inRoom">
            <title class="chatTitle">{{title}}</title>
            <v-form ref="form">
              <v-btn key="logout" v-on:click="logout()" v-if="inRoom" class="exitBtn"><v-icon>arrow_back</v-icon></v-btn>
            </v-form>
          </header>
          <div class="chat-list" v-if="inRoom">
            <template v-for="(item, index) in items">
              <v-subheader
                v-if="item.header"
                :key=index item.header
              >
                {{ item.header }}
              </v-subheader>

              <div
                v-else
                :key="'chat'+index"
                class="chat-item" :class="[item.show]"
              >
                <div class="account">
                  <div class="icon">
                    <img class="iconImage" src="http://icooon-mono.com/i/icon_11213/icon_112131_64.png">
                  </div>
                </div>
                <div>
                  <div class="author" v-html="item.author"></div>
                  <div class="speechBubble" :class="[item.show]">
                    <div class="message" v-html="item.message"></div>
                  </div>
                  <div class="date" v-html="item.createdAt"></div>
                </div>
              </div>
            </template>
          </div>

          <div class="">
            <v-form ref="form">
              <v-text-field key="keyword" v-if="!inRoom" v-model="name" label="名前"></v-text-field>
              <v-btn key="login" v-on:click="login()" v-if="!inRoom">入室</v-btn>
              <v-btn key="logout" v-on:click="logout()" v-if="!inRoom">退室</v-btn>
            </v-form>
          </div>

          <footer class="footer">
            <v-form ref="form" @submit.prevent="submit">
              <div class="footerContents">
                <v-btn small key="image" v-on:click="imgae()" v-if="inRoom" class="ma-0 imageBtn">
                  <v-icon>add_photo_alternate</v-icon>
                </v-btn>
                <v-text-field class="commentInput" key="keyword" single-line outline v-if="inRoom" v-model="keyword" label="コメント記入"></v-text-field>
                <!-- <v-btn key="talk" v-on:click="submit" v-if="inRoom" class="commentBtn">
                  <v-icon>send</v-icon>
                </v-btn> -->
                <v-btn small key="talk" v-on:click="submit" v-if="inRoom" class="ma-0 commentBtn">
                  <v-icon>send</v-icon>
                </v-btn>
              </div>
            </v-form>
          </footer>

        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>


<script>
import firebase from '@/plugins/firebase';
const db = firebase.firestore();
let roomRef = null;
let messageSnapshotUnstab = ()=>{};

export default {
  layout: 'no_header',
  data: ()=>({
    user: null,
    inRoom: false,
    name: "",
    keyword: "",
    items: [],
    members: [],
    roomId: null,
    title: "",
    showState: "",
  }),
  watch: {
    inRoom: function(val){
      if(val){
        // 新着メッセージを監視
        messageSnapshotUnstab = roomRef
          .collection("messages")
          .orderBy('createdAt', 'asc')
          .onSnapshot(doc=>{
            doc.docChanges().forEach(v=>{
              if(v.type == "added"){
                const data = v.doc.data();
                // コメントの表示判定
                // 自分のコメントを右側に表示、他の人のコメントは左側に表示、システム側のコメントは中央に表示
                console.log(this.name);
                console.log(data.author);
                console.log(data.author == this.name);
                if(this.name == data.author){
                  this.showState = 'is-mine';
                }
                else if(!data.author){
                  this.showState = 'is-system';
                }
                else{
                  this.showState = 'is-other';
                }
                this.items.push({
                  author: data.author,
                  message: data.message,
                  createdAt: String(data.createdAt.toDate().getMonth()+1) + '/' + String(data.createdAt.toDate().getDate()) + '  ' + String(data.createdAt.toDate().toLocaleTimeString()),
                  show: this.showState,
                });
              }
            });
          });
      }else{
        messageSnapshotUnstab();
      }
    }
  },
  mounted: async function(){
    await this.getUser();
    this.roomId = this.$route.params.roomid;
    roomRef = db.collection("chats").doc(this.roomId);
    // タイトルを取得
    var getDoc = roomRef.get()
    .then(doc => {
      if (doc.exists)  {
        this.title = doc.data().title;
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
    // メンバー更新時
    roomRef.collection("members").onSnapshot(doc=>{
      doc.docChanges().forEach(v=>{
        const uid = v.doc.id;
        const name = v.doc.data().name;
        if(v.type == "added"){
          if(uid === this.user.uid){
            // 自分がログイン済み
            this.login(name);
          }
          this.members.push({uid, name});
        }else if(v.type=="removed"){
          this.members = this.members.filter(w=>w.uid != uid);
        }
      });
    });
  },
  methods:{
    // 認証情報
    async getUser(){
      if(this.user) return this.user;
      let user = firebase.auth().currentUser;
      if(!user){
        // 未認証ユーザーは認証する
        await firebase.auth().signInAnonymously();
        user = firebase.auth().currentUser;
      }
      return this.user = user;
    },
    async login(name) {
      // 入室
      await roomRef.collection("members").doc(this.user.uid).set({
        name: name||this.name,
        lastAt: new Date()-0,
      });
      this.inRoom = true;
      this.name = name;
    },
    async logout() {
      this.items = [];
      roomRef.collection("members").doc(this.user.uid).delete();
      this.inRoom = false;
    },
    async submit() {
      // 発言
      roomRef.collection('messages').add({
        author: this.name,
        message: this.keyword,
        createdAt: new Date(),
      });
    }
  }
}
</script>


<style lang="scss" scoped>
/* ヘッダー */
.header{
  display: flex;
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  background-color: #E4E4E4;
  padding: 0 8px;
  z-index: 100;
  align-items: center;
}
.chatTitle{
  display: block;
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.exitBtn{
  min-width: 24px !important;
  background: inherit !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  align-self: center;
}

.chat-list{
  padding-top: 40px;
  padding-bottom: 40px;
}

// チャット部分
.chat-item{
  display: flex;
  margin-bottom: 15px;

  .speechBubble{
    position: relative; /* 三角の位置を固定するために設定 */
    display: inline-block;
    max-width: 300px;
    margin: 0px 20px;
    padding: 8px 15px; /* ふきだし内の余白 */
    background: #f0f0f0; /* 背景色 */
    text-align: left; /* テキストの揃え */
    border-radius: 15px;
    flex-direction: row;

    &:after {
      content: '';
      border: 14px solid transparent;
      border-top-color: #f0f0f0;
      position: absolute;
      top: 0;
      left: -10px;
    }
  }
  // じぶんの場合
  &.is-mine{
    flex-direction: row-reverse;

    .speechBubble::after{
      right: -10px;
      left: 10px;
    }
  }

  .icon{
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #555;
    overflow: hidden;
    position: relative;
  }
  .iconImage{
    width: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }

  .message{
    font-size: 14px;
    word-break: break-all;
    line-height: 1.5;
  }
  .author{
    font-size: 12px;
    line-height: 18px;
    min-height: 18px;
    padding-left: 18px;
  }
  .date{
    font-size: 10px;
    padding-left: 20px;
  }

  // システム表示
  &.is-system{
    justify-content: center;

    .speechBubble::after{
      display: none;
    }
    .icon{
      display: none;
    }
    .date{
      display: none;
    }
  }
}

/* フッター */
.footer{
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #E4E4E4;
  padding: 0 8px;
}
.footerContents{
  display: flex;
}

.imageBtn{
  min-width: 24px !important;
  background: inherit !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  align-self: center;
}
.commentBtn{
  min-width: 24px !important;
  background: inherit !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  padding-left: 8px;
  align-self: center;
}
.v-icon{
  width: 30px;
}

div.btn__content {
  padding: 0px;
}

div.card__actions .btn{
  min-width: 0;
}

.commentInput{
  height: 64px;
  padding-top: 4px;
}

</style>

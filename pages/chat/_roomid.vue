<template>
  <v-app id="chat/room">
    <v-container fluid grid-list-xl>
      <v-layout row>
        <header class="header">
          <div class="headerContents">
            <v-form ref="form">
              <v-btn key="logout" v-if="!inRoom" v-on:click="logout()" to="/search" class="exitBtn"><v-icon>arrow_back</v-icon></v-btn>
              <v-layout justify-center v-if="inRoom">
                <v-btn key="logout" @click.stop="dialog = true" class="exitBtn"><v-icon>arrow_back</v-icon></v-btn>
                <v-dialog
                  v-model="dialog"
                  max-width="290"
                >
                  <v-card>
                    <v-card-title class="headline">この部屋から<br>退出しますか？</v-card-title>
                    <v-card-text>
                      再入室する場合は、名前を再入力していただく必要があります
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="min-button"
                        text
                        @click="logout()"
                        to="/search"
                      >
                        はい
                      </v-btn>

                      <v-btn
                        color="min-button min-button__grey"
                        text
                        @click="dialog = false"
                      >
                        いいえ
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>
            </v-form>
            <title class="chatTitle">{{title}}</title>
          </div>
        </header>
        <!-- コメント表示箇所 -->
        <v-flex v-if="inRoom">
          <div id="chat-list" class="chat-list" :scroll="getScrollValue()">
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
                <div class="contents" :class="[item.show]">
                  <div class="author" v-html="item.author"></div>
                  <div class="speechBubble" :class="[item.show]">
                    <!-- item.imageUrlがある場合は画像 -->
                    <div v-if="item.imageUrl" class="message">
                      <a :href=item.imageUrl target="_brank">
                        <img class="sendImage" v-bind:src=item.imageUrl>
                      </a>
                    </div>
                    <div v-else class="message" v-html="item.message"></div>
                  </div>
                  <div class="date" v-html="item.createdAt"></div>
                </div>
              </div>
            </template>
          </div>
          <script>
            window.setTimeout(
              function(){
                const chatList = document.getElementById('chat-list');
                window.scrollTo(0, chatList.scrollHeight);
              }, 1000);
          </script>
        </v-flex>
        <div class="noLogin-background" v-if="!inRoom">
          <div class="noLogin">
            チャットを始めるには、<br/>名前を入力してください
            <v-form ref="form">
              <div class="footerContents">
                <v-text-field key="keyword" class="entryName" v-if="!inRoom" v-model="name" label="名前"></v-text-field>
                <v-btn key="login" class="min-button entryBtn" v-on:click="login()" v-if="!inRoom">入室</v-btn>
              </div>
            </v-form>
          </div>
        </div>
        <footer class="footer">
          <!-- <v-form ref="form" @submit.prevent="submit"  v-if="inRoom"> -->
          <div v-if="inRoom">
            <div class="footerContents">
              <input type="file" style="display: none" ref="image" accept="image/*" @change="onFileChange">
              <v-btn small key="image" v-on:click="pickImage()" class="ma-0 imageBtn">
                <v-icon>add_photo_alternate</v-icon>
              </v-btn>
              <v-textarea class="commentInput" key="keyword" single-line outline v-model="keyword" label="コメント記入" :auto-grow="true" :rows="rows" @keydown.enter="trigger" placeholder="コメント記入"></v-textarea>
              <v-btn small key="talk" v-on:click="submit" class="ma-0 commentBtn">
                <v-icon>send</v-icon>
              </v-btn>
            </div>
          </div>
          <!-- </v-form> -->
        </footer>
      </v-layout>
      <div class="toBottom" v-show="position < (listScroll - 660)" @click="scrollBottom()">
        <v-btn class="mx-2" fab dark small>
          <v-icon>arrow_downward</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-app>
</template>


<script>
function smoothLink(scrollValue = 0) {
  const targetY = scrollValue; //設定したスクロール値を格納
  const interval = 20;
  const divisor = 8; //近く割合（数値が大きいほどゆっくり近く）
  const range = (divisor / 2) + 1; //どこまで近づけば処理を終了するか(無限ループにならないように divisor から算出)
  let toY;
  let nowY = window.pageYOffset; //現在のスクロール値
  //スクロール終了まで繰り返す処理
  (function doScroll() {
    toY = nowY + Math.round((targetY - nowY) / divisor); //次に移動する場所（近く割合は除数による。）
    window.scrollTo(0, toY); //スクロールさせる
    nowY = toY; //nowY更新
    if (document.body.clientHeight - window.innerHeight < toY) {
      //最下部にスクロールしても対象まで届かない場合は下限までスクロールして強制終了
      window.scrollTo(0, document.body.clientHeight);
      return;
    }
    if (toY >= targetY + range || toY <= targetY - range) {
      //+-rangeの範囲内へ近くまで繰り返す
      window.setTimeout(doScroll, interval);
    } else {
      //+-range の範囲内にくれば正確な値へ移動して終了。
      window.scrollTo(0, targetY);
    }
  })();
}


import firebase from '@/plugins/firebase';
import { setTimeout } from 'timers';
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
    dialog: false,
    rows: 1,
    position: 0,
    listScroll: 0,
  }),
  watch: {
    inRoom: function(val){
      if(val){
        // 新着メッセージを監視
        messageSnapshotUnstab = roomRef
          .collection("messages")
          .orderBy('createdAt', 'asc')
          .onSnapshot(doc=>{
            var isScroll = false;
            var lastChatDivs = document.querySelectorAll('#chat-list>div');
            var lastChatDiv = lastChatDivs[lastChatDivs.length-1];
            doc.docChanges().forEach(v=>{
              if(v.type == "added"){
                const data = v.doc.data();
                // コメントの表示判定
                // 自分のコメントを右側に表示、他の人のコメントは左側に表示、システム側のコメントは中央に表示
                if(!data.author){
                  this.showState = 'is-system';
                }else if(this.name == data.author){
                  this.showState = 'is-mine';
                }else{
                  this.showState = 'is-other';
                }
                this.items.push({
                  author: data.author,
                  message: data.message,
                  imageUrl: data.imageUrl,
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
    // スクロールイベントを取得
    document.onscroll = (e) => {
      this.position = document.documentElement.scrollTop || document.body.scrollTop;
    };
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
    },
    async submit() {
      if(this.keyword === '') return;
      // 発言
      roomRef.collection('messages').add({
        author: this.name,
        message: this.keyword.replace(/\n/g, "<br/>"),
        createdAt: new Date(),
      });
      this.refreshInputText();
      this.scrollBottom();
    },
    // エンターキー入力時の処理
    async trigger(event){
        // 日本語入力中のEnterキー操作は無効にする
        if (event.keyCode !== 13 || event.keyCode == 13 && event.shiftKey) return false;
        this.submit();
        this.scrollBottom();
        this.refreshInputText();
        // 改行の処理を止める
        event.preventDefault();
    },
    refreshInputText(){
        this.keyword = '';
        const textarea = document.getElementsByTagName('textarea');
        textarea[0].style.height = '';
    },
    // 一番下にスクロールする
    async scrollBottom(){
      smoothLink(this.listScroll);
      this.setTimeScrollBottom();
    },
    async setTimeScrollBottom(){
      window.setTimeout(function(){
        const list = document.getElementById('chat-list');
        window.scrollTo(0, list.scrollHeight);
      }, 100);
    },
    async getScrollValue(){
      const list = document.getElementById('chat-list');
      if(!list) return false;
      this.listScroll = list.scrollHeight;
    },

    // ファイル選択を表示
    pickImage() {
      this.$refs.image.click()
    },

    // ファイルアップロード処理
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files;
      console.log("onFileChange",files);
      // ファイルのチェック
      // ファイルタイプ
      var myFileType = files[0].type;
      var fileTypeCheck = false;
      var fileExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
      for (var i = 0; i < fileExtensions.length; i++) {
        var fileExtension = fileExtensions[i];
        if (myFileType.indexOf(fileExtension) > -1) {
          fileTypeCheck = true;
          break;
        }
      }
      if (!fileTypeCheck) {
//        this.isError = true
//        this.errorMessage = 'アップロードできるファイルは画像のみです。'
        return
      }
      var file = files[0];
      var filename = file.name;
      var storageRef = firebase.storage().ref();
      var fileRef = storageRef.child(`images/this.roomId/${filename}`);
      fileRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          roomRef.collection('messages').add({
            author: this.name,
            message: "画像",
            imageUrl: downloadURL,
            createdAt: new Date(),
          });
        });
      });
      this.scrollBottom();
    },
  },
  computed: {
    initial: function() {
      var firstFirstNameLetter = this.getInitialOf(this.firstName);
      var firstLastNameLetter = this.getInitialOf(this.lastName);

      var initial = firstFirstNameLetter + '.' + firstLastNameLetter + '.';
      return initial;
    },
  },
}
</script>


<style lang="scss" scoped>
/* ヘッダー */
.header{
  width: 100%;
  height: 32px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  background-color: #E4E4E4;
  padding: 0 8px;
  z-index: 100;
  align-items: center;
}
.headerContents{
  display: flex;
  align-items: center;
  max-width: 640px;
  margin: 0 auto;
}
.chatTitle{
  display: block;
  width: 100%;
  height: 32px;
  font-size: 14px;
  line-height: 2.29;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 16px;
}
.exitBtn{
  min-width: 24px !important;
  background: inherit !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  align-self: center;
}

.chat-list{
  padding-top: 40px;
  padding-bottom: 40px;
  max-width: 640px;
  margin: 0 auto;
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
    padding: 8px 18px; /* ふきだし内の余白 */
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
    margin-left: auto;

    .speechBubble::after{
      right: -10px;
      left: inherit;
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
  .sendImage{
    width: 100%;
    max-width: 300px;
  }
  .contents{
    &.is-mine{
      text-align: right;
    }
  }
  .message{
    font-size: 14px;
    word-break: break-all;
    line-height: 1.5;
  }
  .author{
    font-size: 12px;
    line-height: 1.5;
    min-height: 18px;
    padding:0 18px;
  }
  .date{
    font-size: 10px;
    padding:0 20px;
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
  max-width: 640px;
  margin: 0 auto;
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
  padding-top: 4px;
  margin-left: 8px;
  margin-bottom: -24px;
}

.entryName{
  margin-left: 8px;
}

.entryBtn{
  max-width: inherit;
  margin-top: 12px;
}

.headline{
  font-size: 20px !important;
}

.noLogin-background{
  background: rgba(0,0,0,0.5);
  position: absolute;
  width: 100%;
  height:100%;
}

.noLogin{
  width: auto;
  max-width: 400px;
  height: 200px;
  position: absolute;
  font-size: 20px;
  line-height: 2.29;
  font-weight: bold;
  box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
  border-radius: 2px;
  text-decoration: none;
  padding: 16px;
  top: 0;
  bottom:0;
  right: 0;
  left: 0;
  margin: auto 8px;
  background-color: #FFF;
  @media screen and (min-width:400px) {
    margin: auto;
  }
}
.toBottom{
  position: fixed;
  right: 0px;
  bottom: 68px;
  opacity: 0.5;
}
</style>

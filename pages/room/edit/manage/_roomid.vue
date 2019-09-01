<template>
  <v-app id="room/edit/manage">
    <headerComponent title="ルーム編集" link="/room/edit"></headerComponent>
    <v-content>
      <v-card class="ma-2 pa-2">
        <v-form key="manager_form" v-model="valid" ref="form" lazy-validation>
          <v-text-field key="welcome_message" v-model="welcome_message" label=入室時メッセージ></v-text-field>
          <v-text-field key="exit_message" v-model="exit_message" label=退室時メッセージ></v-text-field>
          <v-layout class="btnWapper">
            <!-- <div class="btnWapper"> -->
            <!-- ↓↓↓ 編集完了したモーダル　↓↓↓ -->
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn color="button font-weight-bold white--text" key="commit" @click="commit" v-on="on">編集</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">編集完了</v-card-title>
                <v-card-text>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="min-button" @click="dialog = false">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- ↑↑↑　編集完了したモーダル　↑↑↑ -->
            <div class="roomUrl__box">
              <div class="roomUrl__head">ルームのURL</div>
              <input
                class="input__copy"
                type="text"
                readonly="true"
                v-model="room_url"
                @click="copyURL"
              >
            </div>
            <!-- ↑↑↑　ルーム削除のモーダル　↑↑↑ -->
            <v-dialog v-model="dialog2" width="500">
              <template v-slot:activator="{ on }">
                <v-btn color="button button__red font-weight-bold white--text" key="deleteRoom" @click="dialog2=true" v-on="on">ルーム削除</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">ルームを削除してもよろしいでしょうか？</v-card-title>
                <v-card-text>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="min-button min-button__red" @click="deleteRoom(); dialog2=false;">
                    はい
                  </v-btn>
                  <v-btn color="min-button min-button__grey" @click="dialog2 = false">
                    いいえ
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- ↑↑↑　ルーム削除のモーダル　↑↑↑ -->
          </v-layout>
        </v-form>
      </v-card>
    </v-content>
    <!-- app -->

  </v-app>

</template>


<script>
import firebase from '@/plugins/firebase';
import HeaderComponent from '../../../../pages/header'
const db = firebase.firestore();
export default {
  components: {
      HeaderComponent
  },
  layout: 'no_header',
  data: ()=>({
    valid: true,
    creator_id: "",
    roomId: null,

    welcome_message: null,
    exit_message: null,

    dialog: false,
    dialog2: false,
    room_url: '',
  }),
  mounted: async function(){
    this.roomId = this.$route.params.roomid;
    await this.getUser();
    const manageDoc = await db.collection("chat_options").doc(this.roomId).get();
    const data = manageDoc.data();
    Object.assign(this, data);
    console.log(data);
    // ルームのURLを生成
    const chatId = db.collection("chats").doc().id;
    this.room_url = location.origin + "/chat/" + chatId;
  },
  methods:{
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
    async commit(){
      this.commit = true;
      const manageRef = await db.collection("chat_options").doc(this.roomId);
      return manageRef.set({
        welcome_message: this.welcome_message,
        exit_message: this.exit_message,
      }, {merge: true});
    },
    async deleteRoom(){
      const batch = db.batch();
      batch.delete(db.collection("chats").doc(this.roomId));
      batch.delete(db.collection("manages").doc(this.roomId));
      batch.delete(db.collection("chat_options").doc(this.roomId));
      await batch.commit().then(v=>{
        console.log("削除しました");
        location.href="/"
      });
    },
    async copyURL(e){
      const textarea = e.currentTarget;
      // 文字をすべて選択
      textarea.select();
      // コピー
      document.execCommand("copy");
      // コピーをお知らせする
      alert("URLをコピーしました");
    }
  }
}
</script>

<style lang="scss" scoped>
.btnWapper{
  display: block;
  text-align: center;
}
.input__copy{
  width: 100% !important;
  border: 1px solid #E4E4E4;
  border-radius: 3px;
  width: calc(100% - 24px);
  height: 48px;
  padding-left: 12px;
  margin: 0;
}
.roomUrl__box{
  margin-top: 28px;
  margin-bottom: 28px;
}
.roomUrl__head{
  font-size: 16px;
  padding-left: 4px;
  margin-bottom: 4px;
  text-align: left;
}
</style>

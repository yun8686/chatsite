<template>
  <v-app id="room/complete">
    <v-content>
      <v-container grid-list-xl fluid>
        <v-card class="ma-2 pb-4">
          <v-card-title class="font-weight-bold title">ルームの作成完了</v-card-title>
          <v-card-text class="body-1">
            部屋を作成しました。以下のURLを共有してチャットをすることができます。
          </v-card-text>
        <input
            class="input__copy"
            type="text"
            readonly="true"
            value="http://localhost:3000/room/complete"
            id="url"
            @click="copyURL()"
        >
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import firebase from '@/plugins/firebase';
const db = firebase.firestore();

export default {
  layout: 'no_header',
  data: ()=>({
//     user: null,
//     valid: true,
//     display: 1,
//     roomname: "",
//     maxmember: "12",
//     is_private:"false",
//     creator_id: "",
//     creator_pw: "",
//     email: "",
//     isSubmitting: false,
//     btnFlag: false,
//     room_validtion: [ 
//       v => !!v || '入力してください'
//     ],
//     num_validtion: [ 
//       v => !!v || '入力してください'
//     ],
//     roomId_validtion: [ 
//       v => !!v || '入力してください'
//     ],
//     password_validtion: [ 
//       v => !!v || '入力してください'
//     ],
//     mail_validtion: [ 
//       v => !!v || '入力してください'
//     ],
  }),
  mounted: async function(){
    // await this.getUser();
  },
  methods:{
    async copyURL(){
      const textarea = document.getElementsByTagName("input")[0];
      // 文字をすべて選択
      textarea.select();
      // コピー
      document.execCommand("copy");
      // コピーをお知らせする
      alert("URLをコピーしました");
    }
//     // 認証情報
//     async getUser(){
//       if(this.user) return this.user;
//       let user = firebase.auth().currentUser;
//       if(!user){
//         // 未認証ユーザーは認証する
//         await firebase.auth().signInAnonymously();
//         user = firebase.auth().currentUser;
//       }
//       return this.user = user;
//     },
//     next: async function (message) {
//       if(this.$refs.form.validate()){
//         this.display++;
//       }
//     },
//     back: function (message) {
//       this.display--;
//     },
//     commit: async function (message) {
//       if(this.$refs.form2.validate()){
//         this.isSubmitting = false;
//       }
//       const batch = db.batch();
//       const chatId = db.collection("chats").doc().id;

//       batch.set(db.collection("chats").doc(chatId), {
//         title: this.roomname, tags: ["わいわい", "20代"],
//         maxmember: this.maxmember,
//         nowmember: 0,
//         is_private: this.is_private,
//       });
//       batch.set(db.collection("manages").doc(chatId), {
//         title: this.roomname,
//         creator_uid: this.user.uid,
//         creator_id: this.creator_id,
//         creator_pw: this.creator_pw,
//         email:this.email,
//       });
//       batch.set(db.collection("chat_options").doc(chatId), {
//         welcome_message: "ようこそ、${author}さん",
//         exit_message: "${author}さんが森に返っていきました。",
//       });
//       await batch.commit();
//       this.isSubmitting = true;
//     },
//     isExistsCreatorId: async function(creator_id){
//     },
  }
}
</script>

<style lang="scss" scoped>
.input__copy{
  border: 1px solid #E4E4E4;
  border-radius: 3px;
  width: calc(100% - 24px);
  height: 48px;
  padding-left: 12px;
  margin: 0 12px;
}
</style>

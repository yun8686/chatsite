<template>
  <v-app id="room/create">
    <headerComponent title="ルーム作成" link="/"></headerComponent>
    <v-content v-if="display===1 || display===2">
      <v-container grid-list-xl fluid>
        <v-card class="ma-2" v-if="display===1">
          <v-stepper alt-labels value="1">
            <v-stepper-header class="stepperHeader">
              <v-stepper-step step="1">ルーム設定</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">パスワード設定</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card>
        <v-card class="ma-2" v-else-if="display===2">
          <v-stepper alt-labels value="2">
            <v-stepper-header class="stepperHeader">
              <v-stepper-step step="1" complete>ルーム設定</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">パスワード設定</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card>
        <v-layout wrap>
          <v-flex xs12>
            <template v-if="display===1">
              <v-card class="ma-2">
                <!-- <v-card-title class="font-weight-bold title">ルーム作成</v-card-title> -->
                <v-container class="mx-16">
                  <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field key="roomname" v-model="roomname" :rules="room_validtion" label="ルーム名"></v-text-field>
                    <v-text-field key="maxmember" v-model="maxmember" label="最大入室可能人数" :rules="num_validtion" mask="##"></v-text-field>
                    <v-layout xs12 sm6 class="py-2 row justify-start">
                      <div class="py-2 pl-3 pr-4">公開設定</div>
                      <v-btn-toggle mandatory class="text-xs-center ml-0" v-model="is_private">
                        <v-btn class="min-button font-weight-bold white--text" key="is_private_false" value="false">
                          公開
                        </v-btn>
                        <v-btn class="min-button font-weight-bold white--text" key="is_private_true" value="true">
                          非公開
                        </v-btn>
                      </v-btn-toggle>
                    </v-layout>
                    <v-layout class="pt-4">
                      <v-btn class="min-button" key="next" v-bind:disabled="!valid" v-on:click="next()">
                        次へ
                      </v-btn>
                    </v-layout>
                  </v-form>
                </v-container>
              </v-card>
            </template>
            <template v-else-if="display===2">
              <v-card class="ma-2">
                <v-card-title class="font-weight-bold title">ルーム作成</v-card-title>
                <v-container class="mx-16">
                  <v-form v-model="valid" ref="form2" lazy-validation>
                    <v-text-field key="creator_id" v-model="creator_id" :rules="roomId_validtion"  label="編集用ID"></v-text-field>
                    <v-text-field key="creator_pw" v-model="creator_pw" :rules="password_validtion"  label="編集用パスワード"></v-text-field>
                    <!-- <v-text-field key="email" v-model="email" :rules="mail_validtion"  label="メールアドレス"></v-text-field> -->
                    <v-layout class="pt-4">
                      <v-btn class="min-button" key="back" v-on:click="back()">戻る</v-btn>
                      <v-btn class="min-button"  key="commit" v-bind:disabled="isSubmitting && !valid" v-on:click="commit()">作成</v-btn>
                    </v-layout>
                  </v-form>
                </v-container>
              </v-card>
            </template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-content v-if="display===3">
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
            v-model="room_url"
            @click="copyURL"
        >
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
import firebase from '@/plugins/firebase';
import HeaderComponent from '../../pages/header'

const db = firebase.firestore();

export default {
  components: {
      HeaderComponent
  },
  layout: 'no_header',
  data: ()=>({
    user: null,
    valid: true,
    display: 1,
    roomname: "",
    maxmember: "12",
    is_private:"false",
    creator_id: "",
    creator_pw: "",
    email: "",
    isSubmitting: false,
    btnFlag: false,
    room_url: "",
    room_validtion: [
      v => !!v || '入力してください'
    ],
    num_validtion: [
      v => !!v || '入力してください'
    ],
    roomId_validtion: [
      v => !!v || '入力してください'
    ],
    password_validtion: [
      v => !!v || '入力してください'
    ],
    mail_validtion: [
      v => !!v || '入力してください'
    ],
  }),
  mounted: async function(){
    await this.getUser();

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
    next: async function (message) {
      if(this.$refs.form.validate()){
        this.display++;
      }
    },
    back: function (message) {
      this.display--;
    },
    commit: async function (message) {
      this.isSubmitting = true;
      if(this.$refs.form2.validate()){
        const batch = db.batch();
        const chatId = db.collection("chats").doc().id;

        batch.set(db.collection("chats").doc(chatId), {
          title: this.roomname, tags: ["わいわい", "20代"],
          maxmember: this.maxmember,
          nowmember: 0,
          is_private: this.is_private,
        });
        batch.set(db.collection("manages").doc(chatId), {
          title: this.roomname,
          creator_uid: this.user.uid,
          creator_id: this.creator_id,
          creator_pw: this.creator_pw,
          email:this.email,
        });
        batch.set(db.collection("chat_options").doc(chatId), {
          welcome_message: "ようこそ、${author}さん",
          exit_message: "${author}さんが森に返っていきました。",
        });
        await batch.commit();

        // チャットルームのurlを作成
        this.room_url = location.origin + "/chat/" + chatId;

        // 画面遷移
        this.display++;
      }
      this.isSubmitting = false;
    },
    isExistsCreatorId: async function(creator_id){
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
.stepperHeader{
  align-items: center;
}
.input__copy{
  border: 1px solid #E4E4E4;
  border-radius: 3px;
  width: calc(100% - 24px);
  height: 48px;
  padding-left: 12px;
  margin: 0 12px;
}
</style>

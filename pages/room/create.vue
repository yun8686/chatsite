<template>
  <v-app id="room/create">
    <v-content>
      <v-container grid-list-xl fluid>
        <v-card class="ma-2" v-if="display===1">
          <v-stepper value="1">
            <v-stepper-header class="stepperHeader">
              <v-stepper-step step="1">ルーム設定</v-stepper-step>
              <div class="stepeer-word">ルーム設定</div>
              <v-divider></v-divider>

              <v-stepper-step step="2"></v-stepper-step>
              <div class="stepeer-word">パスワード設定</div>

            </v-stepper-header>
          </v-stepper>
        </v-card>
        <v-card class="ma-2" v-else-if="display===2">
          <v-stepper value="2">
            <v-stepper-header class="stepperHeader">
              <v-stepper-step step="1" complete>ルーム設定</v-stepper-step>
              <div class="stepeer-word">ルーム設定</div>
              <v-divider></v-divider>

              <v-stepper-step step="2"></v-stepper-step>
              <div class="stepeer-word">パスワード設定</div>

            </v-stepper-header>
          </v-stepper>
        </v-card>
        <v-layout wrap>
          <v-flex xs12>
            <template v-if="display===1">
              <v-card class="ma-2">
                <v-card-title class="font-weight-bold title">ルーム作成</v-card-title>
                <v-container class="mx-16">
                  <v-form v-model="valid" ref="form" lazy-validation>

                    <v-text-field key="roomname" v-model="roomname" label="ルーム名"></v-text-field>
                    <v-text-field key="maxmember" v-model="maxmember" label="最大入室可能人数" mask="##"></v-text-field>
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
                      <v-btn class="min-button" key="next" v-on:click="next()">
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
                  <v-text-field key="creator_id" v-model="creator_id" label="編集用ID"></v-text-field>
                  <v-text-field key="creator_pw" v-model="creator_pw" label="編集用パスワード"></v-text-field>
                  <v-text-field key="email" v-model="email" label="メールアドレス"></v-text-field>
                  <v-layout class="pt-4">
                    <v-btn class="min-button" key="back" v-on:click="back()">戻る</v-btn>
                    <v-btn class="min-button" key="commit" v-bind:disabled="isSubmitting" v-on:click="commit()">作成</v-btn>
                  </v-layout>
                </v-container>
              </v-card>
            </template>
          </v-flex>
        </v-layout>
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
      this.display++;
    },
    back: function (message) {
      this.display--;
    },
    commit: async function (message) {
      this.isSubmitting = true;
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
      this.isSubmitting = false;
    },
    isExistsCreatorId: async function(creator_id){
    },
  }
}
</script>

<style lang="scss" scoped>
.stepperHeader{
  align-items: center;
}
.stepeer-word{
  margin-right: 40px;
}
</style>

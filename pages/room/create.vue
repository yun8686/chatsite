<template>
  <v-app id="room/create">
    <v-content>
      <v-container grid-list-xl fluid>
        <v-layout wrap>
          <v-flex xs12>
            <template v-if="display===1">
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field
                  key="roomname"
                  v-model="roomname"
                  label="ルーム名"
                ></v-text-field>
                <v-text-field
                  key="maxmember"
                  v-model="maxmember"
                  label="最大入室可能人数"
                  mask="##"
                ></v-text-field>
                <v-flex xs12 sm6 class="py-2">
                  <v-btn-toggle v-model="is_private">
                    <v-btn
                      flat
                      key="is_private_false"
                      value="false"
                      color="#00F">
                     公開
                    </v-btn>
                    <v-btn
                      flat
                      key="is_private_true"
                      value="true"
                      color="#F00">
                     非公開
                    </v-btn>
                  </v-btn-toggle>
                </v-flex>
                <v-btn
                  key="next"
                  v-on:click="next()">
                  次へ
                </v-btn>
              </v-form>
            </template>
            <template v-else-if="display===2">
              <v-text-field
                key="creator_id"
                v-model="creator_id"
                label="編集用ID"
              ></v-text-field>
              <v-text-field
                key="creator_pw"
                v-model="creator_pw"
                label="編集用パスワード"
              ></v-text-field>
              <v-text-field
                key="email"
                v-model="email"
                label="メールアドレス"
              ></v-text-field>
              <v-btn key="back" v-on:click="back()">戻る</v-btn>
              <v-btn key="commit" v-bind:disabled="isSubmitting" v-on:click="commit()">作成</v-btn>
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
  methods:{
    next: async function (message) {
      this.display = 2;
    },
    back: function (message) {
      this.display = this.display-1;
    },
    commit: async function (message) {
      this.isSubmitting = true;
      await db.collection("chats").add({
        title: this.roomname, tags: ["わいわい", "20代"],
        maxmember: this.maxmember,
        is_private: this.is_private,
        creator_id: this.creator_id, creator_pw: this.creator_pw, email:this.email,
      });
      this.isSubmitting = false;
    },
    isExistsCreatorId: async function(creator_id){
    },
  }
}
</script>

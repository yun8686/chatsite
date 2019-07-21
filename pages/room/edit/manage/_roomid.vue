<template>
  <v-app id="room/edit/manage">
    <v-content>
      <v-card class="ma-2 pa-2">
        <v-card-title class="font-weight-bold title">ルーム編集</v-card-title>
        <v-form key="manager_form" v-model="valid" ref="form" lazy-validation>
          <v-text-field key="welcome_message" v-model="welcome_message" label=入室時メッセージ></v-text-field>
          <v-text-field key="exit_message" v-model="exit_message" label=退室時メッセージ></v-text-field>
          <v-layout justify-center>
            <!-- ↓↓↓ 編集完了したモーダル　↓↓↓ -->
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on }">
                <v-btn color="button font-weight-bold white--text" key="commit" v-on="on">編集</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  編集完了
                </v-card-title>
                <!-- <v-card-text></v-card-text>
                <v-divider></v-divider> -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="dialog = false">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- ↑↑↑　編集完了したモーダル　↑↑↑ -->
          </v-layout>
        </v-form>
      </v-card>
    </v-content>
    <!-- app -->

  </v-app>

</template>


<script>
import firebase from '@/plugins/firebase';
const db = firebase.firestore();
export default {
  layout: 'no_header',
  data: ()=>({
    valid: true,
    creator_id2: "",
    roomId: null,

    welcome_message: null,
    exit_message: null,

    dialog: false,
  }),
  mounted: async function(){
    this.roomId = this.$route.params.roomid;
    await this.getUser();
    const manageDoc = await db.collection("chat_options").doc(this.roomId).get();
    const data = manageDoc.data();
    Object.assign(this, data);
    console.log(data);
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
  }
}
</script>

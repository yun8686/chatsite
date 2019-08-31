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
    }
  }
}
</script>

<style lang="scss" scoped>
.btnWapper{
  display: block;
  text-align: center;
}
</style>

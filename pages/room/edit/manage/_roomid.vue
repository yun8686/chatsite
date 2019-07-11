<template>
  <v-app id="room/edit/manage">
    <v-content>
      <v-form key="manager_form" v-model="valid" ref="form" lazy-validation>
        <v-text-field key="welcome_message" v-model="welcome_message" label=入室時メッセージ></v-text-field>
        <v-text-field key="exit_message" v-model="exit_message" label=退室時メッセージ></v-text-field>
        <v-btn  key="commit" v-on:click="">編集</v-btn>
      </v-form>
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
    creator_id2: "",
    roomId: null,

    welcome_message: null,
    exit_message: null,
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

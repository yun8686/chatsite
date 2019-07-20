<template>
  <v-app id="room/edit/index">
    <v-content>
      <v-card class="ma-2">
        <v-card-title class="font-weight-bold title">ルーム編集</v-card-title>
        <v-container class="mx-16">
          <v-form ref="form">
            <v-text-field
              key="creator_id"
              v-model="creator_id"
              label="ルームID"
            ></v-text-field>
            <v-text-field
              key="creator_pw"
              v-model="creator_pw"
              label="編集用パスワード"
            ></v-text-field>
            <v-layout justify-center row wrap class="mb-3">
              <v-btn class="button font-weight-bold white--text" key="commit" to="/room/edit/manage">編集</v-btn>
            </v-layout>
          </v-form>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-list-tile :key="'item'+index" :to="item.link">
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="'itemdivider'+index"></v-divider>
            </template>
          </v-list>
        </v-container>
      </v-card>
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
    creator_id: "",
    creator_pw: "12",
    items: [],
  }),
  mounted: async function(){
    await this.getUser();
    db.collection("manages").where("creator_uid", "==", this.user.uid)
    .onSnapshot(doc=>{
      doc.docChanges().forEach(v=>{
        if(v.type == "added"){
          const data = v.doc.data();
          this.items.push({
            title: data.title,
            link: './edit/manage/' + v.doc.id,
          });
        }
      });
    });
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

<style lang="sass" scoped>

</style>


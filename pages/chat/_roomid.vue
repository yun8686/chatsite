<template>
  <v-app id="chat/room">
    <v-container fluid grid-list-xl>
      <v-layout row>
        <v-flex xl4>
          <v-list two-line>
            <template v-for="(member, index) in members">
              <v-subheader
                v-if="member.header"
                :key=index member.header
              >
                {{ member.header }}
              </v-subheader>

              <v-list-tile
                v-else
                :key="'members'+index"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-html="member.uid"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="member.author"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                :key="'divider'+index"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
        <v-flex xl8>
          <v-list two-line>
            <template v-for="(item, index) in items">
              <v-subheader
                v-if="item.header"
                :key=index item.header
              >
                {{ item.header }}
              </v-subheader>

              <v-list-tile
                v-else
                :key="'chat'+index"
              >
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.message"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.author"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider
                :key="'divider'+index"
              ></v-divider>
            </template>
          </v-list>

          <v-form ref="form">
            <v-text-field key="keyword" v-if="inRoom" v-model="keyword" label="発言"></v-text-field>
            <v-text-field key="keyword" v-if="!inRoom" v-model="author" label="名前"></v-text-field>
            <v-btn key="talk" v-on:click="submit()" v-if="inRoom">発言</v-btn>
            <v-btn key="login" v-on:click="login()" v-if="!inRoom">入室</v-btn>
            <v-btn key="logout" v-on:click="logout()" v-if="inRoom">退室</v-btn>
          </v-form>

        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>


<script>
import firebase from '@/plugins/firebase';
const db = firebase.firestore();
let roomRef = null;
let messageSnapshotUnstab = ()=>{};

export default {
  layout: 'no_header',
  data: ()=>({
    inRoom: false,
    user: null,
    author: "",
    username: "",
    keyword: "",
    items: [],
    members: [],
    roomId: null,
  }),
  mounted: async function(){
    await this.getUser();
    console.log("this.user", this.user, this.user.uid);
    this.roomId = this.$route.params.roomid;
    roomRef = db.collection("chats").doc(this.roomId);
    this.items.push({message: this.user.uid});
    // メンバー更新時
    roomRef.collection("members").onSnapshot(doc=>{
      doc.docChanges().forEach(v=>{
        if(v.type == "added"){
          this.members.push({uid: v.doc.id, name: v.doc.data().author});
        }else if(v.type=="removed"){
          this.members = this.members.filter(w=>w.uid != v.doc.id);
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
    async login() {
      // 入室
      await roomRef.collection("members").doc(this.user.uid).set({
        name: this.author,
        lastAt: new Date()-0,
      });
      this.inRoom = true;
      // 新着メッセージを監視
      messageSnapshotUnstab = roomRef
        .collection("messages")
        .orderBy('createdAt', 'asc')
        .onSnapshot(doc=>{
          doc.docChanges().forEach(v=>{
            if(v.type == "added"){
              this.items.push(v.doc.data());
            }
          });
        });
    },
    async logout() {
      messageSnapshotUnstab();
      this.items = [];
      roomRef.collection("members").doc(this.user.uid).delete();
      this.inRoom = false;
    },
    async submit() {
      // 発言
      roomRef.collection('messages').add({
        "author": this.author,
        "message": this.keyword,
        "createdAt": new Date(),
      });
    },
  }
}
</script>

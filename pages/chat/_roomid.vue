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
            <v-text-field
              key="keyword"
              v-model="keyword"
              label="発言"
            ></v-text-field>
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
let uid = null;

let messageSnapshotUnstab = ()=>{};

export default {
  layout: 'no_header',
  data: ()=>({
    inRoom: false,
    uid: "",
    username: "",
    keyword: "",
    items: [],
    members: [],
    roomId: null,
  }),
  mounted: function(){
    this.roomId = this.$route.params.roomid;
    roomRef = db.collection("chats").doc(this.roomId);

    this.items.push({message: this.uid});
    // メンバー更新時
    roomRef.collection("members").onSnapshot(doc=>{
      doc.docChanges().forEach(v=>{
        console.log(v);
        if(v.type == "added"){
          this.members.push({uid: v.doc.id});
        }else if(v.type=="removed"){
          this.members = this.members.filter(w=>w.uid != v.doc.id);
        }
      });
    });

    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        // 入室時
        this.uid = user.uid;
        roomRef.collection("members").doc(this.uid).set({
          lastAt: new Date()-0,
        }).then(()=>{
          this.inRoom = true;
          // メッセージ受信時
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

        });

      }else{
        // 退室時
        this.items = [];
        messageSnapshotUnstab();
        this.members = [];
        this.inRoom = false;
      }
    });

  },
  methods:{
    async login() {
      // 入室
      // ユーザー認証
      const data = await firebase.auth().signInAnonymously();
      console.log(data);
    },
    logout() {
      roomRef.collection("members").doc(this.uid).delete();
      firebase.auth().signOut();
    },
    submit() {
      // 発言
      roomRef.collection('messages').add({
        "author": this.uid,
        "message": this.keyword,
        "createdAt": new Date(),
      });
    },
  }
}
</script>

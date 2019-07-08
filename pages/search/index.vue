<template>
  <v-app id="search/index">
    <v-content class="content">
      <v-form ref="form">
        <v-layout class="fixed-top px-2 header" :class="{is_fixed:isHeader}">
            <v-text-field
              key="keyword"
              v-model="keyword"
              label="キーワードをいれてください"
              class="px-2"
              v-on:input="search()"
            ></v-text-field>
        <!-- <v-btn class="button" key="search" v-on:click="search()">検索</v-btn> -->
        </v-layout>
        <v-checkbox class="px-2" v-model="checkbox1" :label="`満員の場合は表示しない`"></v-checkbox>
      </v-form>

      <v-list two-line >
        <v-card class="">
        <template v-if="loading==true">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </template>
        <template v-else v-for="(item, index) in items">
          <v-subheader
            v-if="item.header"
            :key="'index'+index"
          >
            {{ item.header }}
          </v-subheader>

          <v-list-tile
            v-else
            :to="item.link"
            :key="item.key"
            @click="search()"
          >
            <v-list-tile-content>
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.tags"></v-list-tile-sub-title>
              <v-list-tile-sub-title v-html="item.nowmember + '/' + item.maxmember"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            :key="'divider'+index"
          ></v-divider>
        </template>
        </v-card>
      </v-list>
    </v-content>
  </v-app>
</template>


<script>
import firebase from '@/plugins/firebase';
const db = firebase.firestore();

export default {
  layout: 'no_header',
  data: ()=>({
    loading: true,
    keyword: "",
    items: [],
    scrollY: 0,
    isHeader: false,
  }),
  mounted: function(){
    this.loading = true;
    db.collection("chats").get()
    .then(snapshot => {
      const items = [];
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        items.push({
          key: doc.id,
          title: doc.data().title,
          tags: doc.data().tags,
          subtitle: "",
          nowmember: doc.data().nowmember||0,
          maxmember: doc.data().maxmember||0,
          link: '/chat/' + doc.id,
        });
      });
      this.items = items;
    })
    .finally(()=>{
      this.loading = false;
    });
    // スクロール値を検知
    window.addEventListener('scroll', this.handleScroll)
  },
  methods:{
    search: async function(message) {
      // 検索
      this.loading = true;
      db.collection("chats")
//      .where('capital', '==', true)
      .get()
      .then(snapshot => {
        const items = [];
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          items.push({
            key: doc.id,
            title: doc.data().title,
            tags: doc.data().tags,
            nowmember: doc.data().nowmember||0,
            maxmember: doc.data().maxmember||0,
            subtitle: "",
            link: '/chat/' + doc.id,
          });
        });
        this.items = items;
      })
      .finally(()=>{
        this.loading = false;
      });
    },
    // キーワード検索をフッター吸着にする
    handleScroll() {
        this.scrollY = window.scrollY;
        if(this.scrollY > 160){
          this.isHeader = true;
        }
        else{
          this.isHeader = false;
        }

    },
  }
}
</script>

<style lang="css" scoped>
.content{
  position:relative;
  padding-top: 64px !important;
}

.header{
  position: absolute;
  top: -64px;
  width: 100%;
  z-index: 100;
  background-color: #FAFAFA;
}

.header.is_fixed{
  position: fixed;
  top: 0;
}

</style>

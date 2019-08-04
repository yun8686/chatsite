<template>
  <v-app id="search/index">
    <v-content class="content">
      <v-card class="fixed-top px-2 header" :class="{is_fixed:isHeader}">
        <v-form ref="form">
          <v-layout>
              <v-text-field
                key="keyword"
                v-model="keyword"
                label="キーワードをいれてください"
                class="px-2"
                @blur="search()"
              ></v-text-field>
          <!-- <v-btn class="button" key="search" v-on:click="search()">検索</v-btn> -->
          </v-layout>
          <v-checkbox class="px-2 checkbox" v-model="checkbox1" :label="`満員の場合は表示しない`"></v-checkbox>
        </v-form>
      </v-card>
      <v-list two-line>
        <v-card>
        <template v-if="loading==true">
          <v-progress-circular
            indeterminate
            color="primary"
            class="loading"
          ></v-progress-circular>
        </template>
        <template v-else v-for="(item, index) in items">
          <v-subheader
            v-if="item.header"
            :key="'index'+index"
          >
            {{ item.header }}
          </v-subheader>

          <a
            v-else
            :href="item.link"
            :key="item.key"
            class="pa-1 card"
          >
            <v-list-tile-content class="px-3 pt-2">
              <v-list-tile-title class="title" v-html="item.title"></v-list-tile-title>
              <v-flex class="cardText">
                <div>
                  <v-list-tile-sub-title v-html="item.tags" class="relatedWord"></v-list-tile-sub-title>
                </div>
                <div class="entryNum">
                  <v-list-tile-sub-title class="entryNum" v-html="'参加者' + item.nowmember + '/' + item.maxmember"></v-list-tile-sub-title>
                </div>
              </v-flex>
            </v-list-tile-content>
          </a>
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
  }
}
</script>

<style lang="scss" scoped>
.content{
  position:relative;
  margin: 0 auto;
  padding: 10px;
  max-width: 620px;
}

.header{
  position: sticky;
  width: calc(100% - 20px);
  max-width: 620px;
  z-index: 100;
  background-color: #FAFAFA;
  top: 0;
  right: 0;
  left: 0;
  margin: auto;
}

.checkbox{
  margin-top: 0;
}


.card{
  display: block;
  height: 100%;
  color: #333;
  text-decoration: none;
}

.card > a {
  height: 100% !important;
}

.relatedWord{
  flex: 1;
  word-break: break-word;
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
}

.entryNum{
  width: auto;
  margin-left: auto;
  align-self: flex-end;
}

.cardText{
  width: 100% ;
  display: flex;
}

.loading{
  padding: 20px;
}

</style>

<template>
  <v-app id="chat/room">
    <v-content>
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
        <v-btn key="search" v-on:click="submit()">発言</v-btn>
      </v-form>

    </v-content>
  </v-app>
</template>


<script>
//import localApi from '@/plugins/localApi';
import localApi from '@/plugins/localApi/debug';

export default {
  layout: 'no_header',
  data: ()=>({
    keyword: "",
    items: [],
  }),
  mounted: function(){
    localApi.getMessage({roomId: this.$route.params.roomid})
    .then(response=>{
      this.items = response.data;
    });
  },
  methods:{
    submit() {
      // 発言
    },
  }
}
</script>

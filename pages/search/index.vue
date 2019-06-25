<template>
  <v-app id="search/index">
    <v-content>
      <v-form ref="form">
        <v-text-field
          key="keyword"
          v-model="keyword"
          label="キーワード"
        ></v-text-field>
        <v-btn key="search" v-on:click="search()">検索</v-btn>
      </v-form>

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
            :key="item.key"
            @click="search()"
          >
            <v-list-tile-content>
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider
            :key=divider item.header
          ></v-divider>
        </template>
      </v-list>
    </v-content>
  </v-app>
</template>


<script>
export default {
  layout: 'no_header',
  data: ()=>({
    keyword: "",
    items: [
      { header: 'Today' },
      {
        key: "waiwai1",
        title: 'わいわいチャット１',
        subtitle: 'わいわい'
      },
      {
        key: "waiwai2",
        title: 'わいわいチャット２',
        subtitle: 'わいわい'
      },
      {
        key: "waiwai3",
        title: 'わいわいチャット３',
        subtitle: 'わいわい'
      },
      { header: 'Yesterday' },
      {
        key: "waiwai4",
        title: 'わいわいチャット４',
        subtitle: 'わいわい'
      },
    ],
  }),
  methods:{
    search(message) {
      // 検索
      console.log("kensaku")
    },
  }
}
</script>

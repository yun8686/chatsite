<template>
  <v-app id="search/index">
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
              <v-list-tile-title v-html="item.title"></v-list-tile-title>
              <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
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
export default {
  layout: 'no_header',
  data: ()=>({
    keyword: "",
    items: [
      { header: 'Today' },
      {
        title: 'わいわいチャット１',
        subtitle: 'わいわい'
      },
      {
        title: 'わいわいチャット２',
        subtitle: 'わいわい'
      },
      {
        title: 'わいわいチャット３',
        subtitle: 'わいわい'
      },
      {
        title: 'わいわいチャット４',
        subtitle: 'わいわい'
      },
    ],
  }),
  methods:{
    submit(message) {
      // 発言
      this.items.push({title: this.keyword, subtitle: this.keyword});
    },
  }
}
</script>

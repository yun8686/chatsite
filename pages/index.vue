<template>
  <v-flex xs12>
    <v-card class="header">
      <img src="../assets/image/logo.svg" class="logo">
    </v-card>
    <v-card class="ma-2">
      <v-card-title ><h1 class="font-weight-bold title">Freeオープンチャットとは</h1></v-card-title>
      <v-card-text class="body-1">
        無料で手軽に作れるレンタルチャットのサイトです。<br/>
        ルームを作成してURLを共有すれば、友人とチャットをすることができます。<br/>
        また合言葉の設定でプライベートチャットをすることも可能です。<br/>
        オープンチャット機能もありますので、タイトルで検索して、共通の話題でチャットも楽しめます。</v-card-text>
    </v-card>
    <v-card class="pa-2 ma-2">
      <v-layout justify-center row wrap class="mb-3">
        <v-btn class="button font-weight-bold white--text" to="/room/create">チャットルーム作成</v-btn>
        <v-btn color="button font-weight-bold white--text" to="/room/edit">チャットルームを編集</v-btn>
      </v-layout>
      <v-layout justify-center row wrap>
        <v-btn color="button font-weight-bold white--text" to="/search">公開ルームを探す</v-btn>
        <!-- <v-btn color="button font-weight-bold white--text" to="/search">合言葉で探す</v-btn> -->
      </v-layout>
    </v-card>
    <v-card class="pa-2 ma-2">
      お問い合わせ先
      https://twitter.com/kakun_furou
    </v-card>
  </v-flex>
</template>

<script>
export default {
  layout: 'no_header'
}
</script>
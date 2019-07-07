<template>
  <v-flex xs12>
    <v-card class="ma-2">
      <v-card-title class="font-weight-bold title">FreeRoomとは</v-card-title>
      <v-card-text class="body-1">無料でレンタルチャットが使えるサイトです。</v-card-text>
    </v-card>
    <v-card class="pa-2 ma-2">
      <v-layout justify-center row wrap class="mb-3">
        <v-btn class="button font-weight-bold white--text" to="/room/create">チャットルーム作成</v-btn>
        <v-btn color="button font-weight-bold white--text" to="/room/edit">チャットルームを編集</v-btn>
      </v-layout>
      <v-layout justify-center row wrap>
        <v-btn color="button font-weight-bold white--text" to="/search">公開ルームを探す</v-btn>
        <v-btn color="button font-weight-bold white--text" to="/search">合言葉で探す</v-btn>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  layout: 'no_header'
}
</script>

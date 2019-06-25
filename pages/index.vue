<template>
  <v-flex xs12>
    <v-card>
      <v-card-title class="font-weight-bold">チャットルーム作成</v-card-title>
      <v-btn color="success" to="/room/create">Success</v-btn>
    </v-card>
    <v-card>
      <v-card-title class="font-weight-bold">チャットルーム編集</v-card-title>
      <v-btn color="success" to="/room/edit">Success</v-btn>
    </v-card>
    <v-card>
      <v-card-title class="font-weight-bold">チャットルーム検索</v-card-title>
      <v-btn color="success" to="/search">Success</v-btn>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  layout: 'no_header'
}
</script>

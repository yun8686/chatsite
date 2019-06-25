<template>
  <v-app id="room/edit/index">
    <v-content>
      <v-form ref="form">
        <v-text-field
          key="creator_id"
          v-model="creator_id"
          label="ルームID"
        ></v-text-field>
        <v-text-field
          key="creator_pw"
          v-model="creator_pw"
          label="編集用パスワード"
        ></v-text-field>
        <v-btn  key="commit" to="/room/edit/manage">編集</v-btn>
      </v-form>
    </v-content>
  </v-app>
</template>


<script>
export default {
  layout: 'no_header',
  data: ()=>({
    creator_id: "",
    creator_pw: "12",
  }),
  methods:{
    commit: function (message) {
      // 認証
    },
  }
}
</script>

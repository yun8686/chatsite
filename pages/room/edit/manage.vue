<template>
  <v-app id="room/edit/manage">
    <v-content>
      <v-form key="manager_form" v-model="valid" ref="form" lazy-validation>
        <v-text-field
          key="creator_id2"
          v-model="creator_id2"
          label=マネージャー
        ></v-text-field>
        <v-btn  key="commit" v-on:click="commit()">編集</v-btn>
      </v-form>
    </v-content>
  </v-app>
</template>


<script>
export default {
  layout: 'no_header',
  data: ()=>({
    valid: true,
    creator_id2: "",
  }),
  methods:{
    commit: function (message) {
    console.log(this.$route.params)
      // 認証
    },
  }
}
</script>

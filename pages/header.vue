<template>
  <v-card class="header__box">
    <v-btn class="btn" :to=link><v-icon class="icon">arrow_back</v-icon></v-btn>
      <p class="header__title">{{title}}</p>
  </v-card>
</template>

<script>
export default {
    props: ['title','link']
}
</script>

<style lang="scss" scoped>
.header__box{
  display: flex;
  width: 100%;
  height: 40px;
}
.btn{
  min-width: 24px !important;
  background: inherit !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
  align-self: center;
  &::before{
    background-color: inherit !important;
  }
}
.icon{
  padding: 0 8px;
}
.header__title{
  margin: 0;
  font-size: 16px;
  line-height: 40px;
}
</style>>
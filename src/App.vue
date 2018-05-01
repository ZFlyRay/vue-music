<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header';
  import Tab from 'components/tab/tab';
  import Player from 'components/player/player.vue';
  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  };
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  // ~common 表示相对 common，
  // 然后我们在 webpack.base.conf.js
  // 配置了 common 的 alias，就能找到了它的路径了
  @import "~common/stylus/variable"

</style>

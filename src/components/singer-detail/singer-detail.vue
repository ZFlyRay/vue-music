<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex';
  import {getSingerDetail} from 'api/singer';
  import {ERR_OK} from 'api/config';
  import {createSong, isValidMusic} from 'common/js/song';
  import MusicList from 'components/music-list/music-list';

  export default {
    data() {
      return {
        songs: []
      };
    },
    created() {
      this._getDetail();
    },
    computed: {
      title() {
        return this.singer.name;
      },
      bgImage() {
        return this.singer.avatar;
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      _getDetail() {
        // 防止用户在该页面刷新后，获取不到singer，退回/singer路由
        if (!this.singer.id) {
          this.$router.push('/singer');
          return;
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list);
          }
        });
      },
      _normalizeSongs(list) {
        let ret = [];
        list.forEach((item) => {
          // 对象的解构赋值对象的属性没有次序，变量必须与属性同名，
          // 才能取到正确的值，即变量名与属性名一一对应，次序不重要，
          // list是数组，item就是对象，musicData是item对象里的一个属性名
          // example :  var {foo,bar,baz} = {bar:'aaa',foo:'bbb'}
          // console.log(foo); =>bbb  console.log(bar); =>aaa  console.log(baz); => undefined
          let {musicData} = item;
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      }
    },
    components: {
      MusicList
    }
  };
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>

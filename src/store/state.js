import {playMode} from 'common/js/config';
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache';

const state = {
  // singer-detail
  singer: {},
  // 播放器内核
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  // 搜索历史（localStorage）
  searchHistory: loadSearch(),
  // 最近播放过的歌曲
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
};

export default state;

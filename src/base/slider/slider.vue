<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--设置插槽，slot会被替换为父组件在子组件标签里所写的模板结构-->
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {addClass} from 'common/js/dom';

  export default {
    name: 'slider',
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      };
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      // 浏览器刷新一般在17ms后，此处设置20ms为经验值
      // 也可使用this.$nextTick()
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();

        if (this.autoPlay) {
          this._play();
        }
      }, 20);

      // 优化，当适口大小变化时，需要重新计算slider-group和slider的宽度
      window.addEventListener('resize', () => {
        if (!this.slider || !this.slider.enabled) {
          return;
        }

        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
          this.refresh();
        }, 60);
      });
    },
    // keep-alive组件激活时调用
    activated() {
      this.slider.enable();
      // 计算出当前轮播页码
      let pageIndex = this.slider.getCurrentPage().pageX;
      if (pageIndex > this.dots.length) {
        pageIndex = pageIndex % this.dots.length;
      }
      this.slider.goToPage(pageIndex, 0, 0);
      if (this.loop) {
        pageIndex -= 1;
      }
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    // keep-alive组件停用时调用
    deactivated() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    beforeDestroy() {
      this.slider.disable();
      clearTimeout(this.timer);
    },
    methods: {
      refresh() {
        if (this.slider) {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;

        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = sliderWidth + 'px';
          width += sliderWidth;
        }
        // 如果是循环轮播，则还需加两倍sliderWidth（左右各一个）
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        this.slider.on('scrollEnd', this._onScrollEnd);

        this.slider.on('touchend', () => {
          if (this.autoPlay) {
            this._play();
          }
        });

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
      },
      _onScrollEnd() {
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this._play();
        }
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _play() {
        let pageIndex = this.slider.getCurrentPage().pageX + 1;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      }
    }
  };
</script>

<style scoped lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

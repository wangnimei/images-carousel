<template>
  <div
    ref="imgWrapper"
    @mouseover="onMouseOver"
  >
    <div
      v-if="loadSuccess"
      ref="img"
      class="img-view"
      @mousedown="onMouseDown($event)"
      @mousemove="onMouseMove($event)"
      @mouseup="onMouseUp"
      @mouseout="onMouseOut"
      @mouseover="onMouseOver"
      @wheel.prevent.stop="onScroll"
    />
    <img
      v-else
      :src="imgUrl"
      style="width: 100%; height: 100%"
    >
  </div>
</template>
<script>
export default {
  name: 'ImgView',
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '#F2F2F2',
    },
  },
  data() {
    return {
      computedHeight: '',
      computedWidth: '',
      imgWidth: 0,
      imgHeight: 0,
      isMouseDown: false,
      styleObjectImg: {
        backgroundSize: '100% 100%',
        backgroundPosition: '0px 0px',
      },
      backgroundSize: {
        w: '100%',
        h: '100%',
      },
      backgroundPosition: {
        x: '0px',
        y: '0px',
      },
      loadSuccess: true,
    };
  },
  watch: {
    imgUrl: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          const { imgWrapper, img } = this.$refs;
          this.styleObjectImg.backgroundImage = `url(${this.imgUrl})`;
          this.init()
            .then(() => {
              this.loadSuccess = true;
              this.$nextTick(() => {
                this.computedHeight = imgWrapper.offsetHeight;
                this.computedWidth = imgWrapper.offsetWidth;
                img.style.backgroundImage = `url(${this.imgUrl})`;
                img.style.width = `${this.computedWidth}px`;
                img.style.height = `${this.computedHeight}px`;
                img.style.backgroundSize = `${this.computedWidth}px ${this.computedHeight}px`;
                img.style.backgroundPosition = '0px 0px';
                // 缓存图片大小，位置
                this.backgroundSize = {
                  w: this.computedWidth,
                  h: this.computedHeight,
                };
                this.backgroundPosition = {
                  x: 0,
                  y: 0,
                };
              });
            })
            .catch(() => {
              this.loadSuccess = false;
            });
        });
      },
    },
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = this.imgUrl;
        img.onload = () => {
          this.imgWidth = img.width;
          this.imgHeight = img.height;
          resolve();
        };
        img.onerror = () => {
          reject();
        };
      });
    },
    onMouseDown() {
      this.isMouseDown = true;
    },
    onMouseUp() {
      this.isMouseDown = false;
    },
    onMouseOver() {
      this.isMouseDown = false;
    },
    onMouseOut() {
      this.isMouseDown = false;
    },
    onMouseMove(event) {
      if (this.isMouseDown) {
        const e = event || window.event;
        const { backgroundSize: { w, h }, computedHeight, computedWidth } = this;
        let { backgroundPosition: { x, y } } = this;

        x += e.movementX;
        y += e.movementY;

        if (x >= 0) {
          x = 0;
        } else if (x <= computedWidth - w) {
          x = computedWidth - w;
        }

        if (y >= 0) {
          y = 0;
        } else if (y <= computedHeight - h) {
          y = computedHeight - h;
        }

        this.backgroundPosition = { x, y };
        this.$refs.img.style.backgroundPosition = `${x}px ${y}px`;
      }
    },
    onScroll(event) {
      const e = event || window.event;
      const backgroundSizeW = this.backgroundSize.w;
      const backgroundSizeH = this.backgroundSize.h;
      const positionX = this.backgroundPosition.x;
      const positionY = this.backgroundPosition.y;
      let x;
      let y;
      let w;
      let h;

      if (e.deltaY < 0) {
        w = backgroundSizeW * 1.1;
        h = backgroundSizeH * 1.1;
        x = (backgroundSizeW - w) / 2 + positionX;
        y = (backgroundSizeH - h) / 2 + positionY;
      } else {
        w = backgroundSizeW / 1.1;
        h = backgroundSizeH / 1.1;
        x = (backgroundSizeW - w) / 2 + positionX;
        y = (backgroundSizeH - h) / 2 + positionY;
      }
      // 缩放时判断范围，让图片始终保持在框内
      if (x >= 0) {
        x = 0;
      } else if (x <= this.computedWidth - w) {
        x = this.computedWidth - w;
      }
      if (y >= 0) {
        y = 0;
      } else if (y <= this.computedHeight - h) {
        y = this.computedHeight - h;
      }
      // 图片不能缩放到比框小
      w = w <= this.computedWidth ? this.computedWidth : w;
      h = h <= this.computedHeight ? this.computedHeight : h;
      // 将图片位置和大小缓存
      this.backgroundSize = { w, h };
      this.backgroundPosition = { x, y };
      // 设置图片位置和大小
      this.$refs.img.style.backgroundSize = `${w}px ${h}px`;
      this.$refs.img.style.backgroundPosition = `${x}px ${y}px`;
    },
  },
};
</script>


<style lang="scss">
.img-view {
  cursor: move;
  background-repeat: no-repeat;
}
</style>

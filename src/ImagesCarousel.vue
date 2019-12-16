<template>
  <div
    v-if="visible"
    ref="wrapper"
    tabindex="0"
    class="imagesCarousel"
  >
    <i
      class="iconfont icon-close"
      @click.stop="handleClose"
    />
    <div class="imagesCarousel__main">
      <div
        v-if="thumbnailList.length > 1"
        class="imagesCarousel__prev iconfont icon-back"
        :class="{ 'imagesCarousel__prev--disabled': currentIndex === 0 }"
        style="margin-right: 40px;"
        @click.stop="handleImagePrev"
      />
      <div class="imagesCarousel__image">
        <div
          ref="imageScroll"
          class="imagesCarousel__image-scroll"
        >
          <img-view
            v-for="item in thumbnailList"
            :key="item.index"
            class="imagesCarousel__image-item"
            :img-url="item.src"
          />
        </div>
      </div>
      <div
        v-if="thumbnailList.length > 1"
        class="imagesCarousel__next iconfont icon-next"
        :class="{ 'imagesCarousel__next--disabled': currentIndex === thumbnailList.length - 1 }"
        style="margin-left: 40px;"
        @click.stop="handleImageNext"
      />
    </div>
    <div class="imagesCarousel__describe">
      {{ currentIndex + 1 }}/{{ thumbnailList.length }}
    </div>
    <div class="imagesCarousel__thumbnail">
      <div
        class="imagesCarousel__thumbnail-wrapper"
        :style="{ 'max-width': `${ thumbnailScope * 94 }px` }"
      >
        <div
          ref="thumbnailScroll"
          class="imagesCarousel__thumbnail-scroll"
        >
          <div
            v-for="(item, i) in thumbnailList"
            :key="i"
            class="imagesCarousel__thumbnail-item"
          >
            <img
              :class="{ 'imagesCarousel__thumbnail-item--active': currentIndex === i }"
              :src="item.src"
              style="width: 80px; height: 80px;"
              @click.stop="thumbnailJump(i)"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImgView from './ImgView';

export default {
  name: 'ImagesCarousel',
  components: {
    ImgView,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    thumbnailList: {
      type: Array,
      default: () => ([]),
    },
    thumbnailScope: {
      type: Number,
      default: 12,
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      thumbnailLeft: 0,
      imageLeft: 0,
      currentIndex: 0,
      thumbnailViewScope: {
        start: 0,
        end: this.thumbnailScope - 1,
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.setThumbnailIndex(this.index);
        this.$nextTick(() => {
          this.$refs.wrapper.onkeydown = (event) => {
            const e = event || window.event;
            e.stopPropagation();
            switch (e.keyCode) {
              case 27:
                this.handleClose();
                break;
              case 37:
                this.handleImagePrev();
                break;
              case 39:
                this.handleImageNext();
                break;
              default:
                break;
            }
          };
          this.$refs.wrapper.focus();
        });
      }
    },
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  methods: {
    handleImagePrev() {
      if (this.currentIndex === 0) return;
      this.currentIndex -= 1;
      this.setImagePosition();
      this.setThumbnailPosition();
    },
    handleImageNext() {
      if (this.currentIndex === this.thumbnailList.length - 1) return;
      this.currentIndex += 1;
      this.setImagePosition();
      this.setThumbnailPosition();
    },
    setImagePosition() {
      const { imageScroll } = this.$refs;
      this.imageLeft = this.currentIndex * 859;
      imageScroll.style.transform = `translate(-${this.imageLeft}px, 0)`;
    },
    setThumbnailPosition() {
      const {
        $refs: { thumbnailScroll }, currentIndex, thumbnailViewScope, thumbnailScope,
      } = this;
      if (currentIndex > thumbnailViewScope.end) {
        thumbnailViewScope.end = currentIndex;
        thumbnailViewScope.start = currentIndex - (thumbnailScope - 1);
      }
      if (currentIndex < thumbnailViewScope.start) {
        thumbnailViewScope.start = currentIndex;
        thumbnailViewScope.end = currentIndex + (thumbnailScope - 1);
      }
      this.thumbnailLeft = -thumbnailViewScope.start * 94;
      thumbnailScroll.style.transform = `translate(${this.thumbnailLeft}px, 0)`;
    },
    setThumbnailIndex(index) {
      const { thumbnailList } = this;
      for (let i = 0; i < thumbnailList.length; i += 1) {
        if (i === index) {
          this.currentIndex = i;
          this.$nextTick(() => {
            this.setImagePosition();
            this.setThumbnailPosition();
          });
          break;
        }
      }
    },
    thumbnailJump(index) {
      const { imageScroll } = this.$refs;
      this.imageLeft = -(index * 859);
      imageScroll.style.transform = `translate(${this.imageLeft}px, 0)`;
      this.setThumbnailIndex(index);
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss">
@import './assets/iconfont.css';

.imagesCarousel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .8);
  z-index: 9999;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", Arial, sans-serif;

  &__main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 572px;
  }

  &__image {
    width: 859px;
    height: 572px;
    overflow: hidden;
    font-size: 0;
  }

  &__image-item {
    display: inline-block;
    width: 859px;
    height: 572px;
  }

  &__prev,
  &__next {
    width: 60px;
    height: 60px;
    border: 2px solid #E9E9E9;
    border-radius: 100%;
    box-sizing: border-box;
    line-height: 56px;
    text-align: center;
    color: #E9E9E9;
    font-size: 30px;
    font-weight: 700;
    cursor: pointer;

    &--disabled {
      color: #5A5A5A;
      cursor: not-allowed;
      border-color: #5A5A5A;
    }
  }

  &__describe {
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 24px;
    text-align: center;
  }

  &__thumbnail {
    display: flex;
    align-items: center;
    margin: 0 auto;

    .thumbnail-icon {
      font-size: 20px;
      color: #E9E9E9;
      font-weight: 700;
      cursor: pointer;
    }

    .thumbnail-icon--disabled {
      color: #5A5A5A;
      cursor: not-allowed;
    }
  }

  &__thumbnail-wrapper {
    // max-width: 1128px;
    overflow: hidden;
  }

  &__thumbnail-scroll,
  &__image-scroll {
    transition: transform .3s ease;
    white-space: nowrap;
    font-size: 0;
  }

  &__thumbnail-item {
    display: inline-block;
    width: 94px;
    height: 88px;
    text-align: center;
    line-height: 88px;

    img {
      display: inline-block;
      vertical-align: middle;
      box-sizing: content-box;
      cursor: pointer;
    }

    &--active {
      border: 4px solid #ffffff;
    }
  }

  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 30px;
    color: #E9E9E9;
    cursor: pointer;
  }
}
</style>

<template>
  <div>
    <button @click.stop="handleClick">
      show images
    </button>
    <images-carousel
      :visible.sync="showImages"
      :thumbnail-list="list"
      :thumbnail-scope="4"
      :index="index"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showImages: false,
      index: 0,
      list: [
        {
          src: '/static/img.jpg',
        },
        {
          src: '/static/img.jpg',
        },
        {
          src: '/static/img.jpg',
        },
        {
          src: '/static/img.jpg',
        },
        {
          src: '/static/img.jpg',
        },
      ],
    };
  },
  methods: {
    handleClick() {
      this.showImages = true;
      this.index = 4;
    },
  },
};
</script>

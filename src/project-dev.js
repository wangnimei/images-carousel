// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import App from './App.vue';
import ImagesCarousel from './project-pro';

Vue.use(ImagesCarousel);

new Vue({
  el: '#app',
  render: (h) => h(App),
});

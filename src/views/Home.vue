<template>
  <div class="home-container">
    <div class="title">
      <div ref="youbikeIcon"></div>
      <TheLogo class="logo" />
      <p>微笑單車．暢遊城市</p>
    </div>
    <div class="button-group">
      <router-link to="/bike"> <button class="home-button">尋找Youbike</button></router-link>
      <router-link to="/bikeway"> <button class="home-button">查詢自行車道</button></router-link>
      <router-link to="/tourism">
        <button class="home-button">附近景點、美食(施工中)</button></router-link
      >
    </div>
    <div class="copyright">Where’s YouBike © Code: DotSea / Design: KT</div>
  </div>
</template>

<script>
import lottie from 'lottie-web';
import jsonData from '../assets/svg/youbike.json';
import TheLogo from '../assets/svg/logo.svg';

export default {
  name: 'Home',
  components: { TheLogo },

  mounted() {
    lottie.loadAnimation({
      container: this.$refs.youbikeIcon, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jsonData, // the path to the animation json
    });
  },
  beforeUnmount() {
    lottie.destroy();
  },
};
</script>

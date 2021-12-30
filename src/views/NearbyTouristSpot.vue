<template>
  <div class="container">
    <TheHeader class="header" />
    <router-view></router-view>

    <TheFooter v-if="!this.$route.params.id" class="footer" />
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';

export default {
  name: 'NearbyTouristSpot',
  components: {
    TheHeader,
    TheFooter,
  },
  //   mounted() {
  //     if (document.visibilityState === 'visible') {
  //       console.log('is visible');
  //     } else {
  //       console.log('not visible');
  //     }
  //     console.log(document.hidden);
  //   },
};
</script>

<style></style>

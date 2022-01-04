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
};
</script>

<style></style>

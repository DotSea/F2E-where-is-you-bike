<template>
  <div class="container">
    <TheHeader class="header" />
    <BikeMap />
    <LoadingPage v-if="isLoading" />

    <TheFooter class="footer" />
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import BikeMap from '../components/BikeMap.vue';
import LoadingPage from '../components/LoadingPage.vue';

export default {
  name: 'FindingBike',
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    TheHeader,
    TheFooter,
    BikeMap,
    LoadingPage,
  },
};
</script>

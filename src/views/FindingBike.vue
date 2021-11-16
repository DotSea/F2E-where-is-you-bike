<template>
  <div class="container">
    <TheHeader class="header" />
    <BikeMap />
    <TheFooter class="footer" />
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import TheFooter from '../components/TheFooter.vue';
import BikeMap from '../components/BikeMap.vue';

export default {
  name: 'FindingBike',
  components: { TheHeader, TheFooter, BikeMap },
};
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header,
.footer {
  height: 64px;
}
</style>

<template>
  <div class="container">
    <TheHeader class="header" />
    <RouteMap />
    <TheFooter class="footer" />
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import RouteMap from '../components/RouteMap.vue';
import TheFooter from '../components/TheFooter.vue';

export default { name: 'FindingRoute', components: { TheHeader, RouteMap, TheFooter } };
</script>

<style></style>

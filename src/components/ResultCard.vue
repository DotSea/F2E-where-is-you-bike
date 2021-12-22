<template>
  <div @click="selectRoute(this.routeId)" :id="this.routeId">
    <slot class="route-name" name="route-name"></slot>
    <div class="route-info">
      <div class="route-road">
        <slot class="direction" name="direction"></slot>
        <slot class="length" name="length"></slot>
      </div>
      <div class="route-location">
        <RouteMarker />
        <p><slot class="city-name" name="city-name"></slot></p>
        <p><slot class="town-name" name="town-name"></slot></p>
      </div>
    </div>
  </div>
</template>

<script>
import RouteMarker from '../assets/svg/route-marker.svg';

export default {
  components: { RouteMarker },
  props: ['routeId'],
  inject: ['selectRoute'],
};
</script>

<style lang="scss" scoped></style>

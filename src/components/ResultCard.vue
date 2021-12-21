<template>
  <div class="card-item" @click="selectRoute(this.routeId)" :id="this.routeId">
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

<style lang="scss" scoped>
.card-item {
  padding: 12px;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  margin-bottom: 10px;

  .route-name {
    width: 100%;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
  }
  .route-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 9px;
    color: #7a7a7a;
  }
  .route-road {
    font-size: 13px;
    line-height: 15px;
    width: auto;
    display: flex;
    justify-content: space-between;
  }
  .route-location {
    font-size: 13px;
    line-height: 19px;
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    p {
      margin: 0px 2px;
    }
  }
}
</style>

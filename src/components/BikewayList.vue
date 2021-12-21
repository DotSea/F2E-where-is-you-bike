<template>
  <div v-if="!isRouteSelected()" class="card-list">
    <p v-if="!this.bikewayData" class="not-choose-city">尚未選擇任何縣市</p>
    <ul v-else>
      <li v-for="(route, index) in JSON.parse(this.bikewayData)" :key="index">
        <ResultCard v-if="route" :route-id="index">
          <template v-slot:route-name>{{ route.RouteName }}</template>
          <template v-slot:direction>{{ route.Direction }}</template>
          <template v-slot:length>
            {{
              route.CyclingLength
                ? route.CyclingLength >= 1000
                  ? `  ${route.CyclingLength / 1000} 公里`
                  : `  ${route.CyclingLength} 公尺`
                : ''
            }}</template
          >
          <template v-slot:city-name>{{ route.City }}</template>
          <template v-slot:town-name>{{ route.Town }}</template>
        </ResultCard>
      </li>
    </ul>
  </div>
</template>

<script>
import ResultCard from './ResultCard.vue';

export default {
  props: ['bikewayData'],
  data() {
    return { city: '' };
  },
  components: { ResultCard },
  inject: ['selectedCity', 'isRouteSelected'],
};
</script>

<style lang="scss" scoped>
.card-list {
  height: 100%;
  margin: 25px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
}
</style>

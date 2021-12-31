<template>
  <p v-if="!this.bikewayData" class="not-choose-city">尚未選擇任何縣市</p>
  <ul v-else class="card-list">
    <li
      class="card-item bikeway-item"
      v-for="(route, index) in JSON.parse(this.bikewayData)"
      :key="index"
    >
      <ResultCard v-if="route" @click="selectRoute(index)">
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
</template>

<script>
import ResultCard from './ResultCard.vue';

export default {
  props: ['bikewayData'],
  data() {
    return { city: '' };
  },
  watch: {
    '$route.query.city': {
      handler() {
        if (this.$route.query.city) {
          this.getBikewayData(this.$route.query.city);
        }
      },
    },
  },
  components: { ResultCard },
  inject: ['getBikewayData', 'selectRoute'],
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.bikewayData && vm.$route.query.city) {
        vm.getBikewayData(vm.$route.query.city);
      }
    });
  },
};
</script>

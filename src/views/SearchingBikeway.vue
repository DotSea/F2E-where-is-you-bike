<template>
  <div class="container">
    <TheHeader class="header" />
    <router-view />
  </div>
</template>

<script>
import TheHeader from '../components/TheHeader.vue';

export default {
  name: 'FindingRoute',
  data() {
    return {
      selectedCity: '',
      bikewayData: '',
      isRouteSelected: '',
    };
  },
  methods: {
    async getBikewayData(city) {
      const res = await this.axiosInstance.get(`/Cycling/Shape/${city}`);
      this.bikewayData = res.data;
      await this.$router.push({
        name: 'BikewayList',
        params: { city, bikewayData: JSON.stringify(this.bikewayData) },
        query: { city },
      });
    },
    selectRoute(index) {
      this.isRouteSelected = true;
      this.$router.push({
        name: 'BikewayMap',
        params: { routeData: JSON.stringify(this.bikewayData[index]) },
        query: { city: this.$route.query.city, id: index },
      });
    },
    async selectCity(city) {
      this.isRouteSelected = false;
      this.selectedCity = city;
      await this.getBikewayData(city);
    },
  },
  components: { TheHeader },
  provide() {
    return {
      selectRoute: this.selectRoute,
      isRouteSelected: () => this.isRouteSelected,
      selectedCity: () => this.selectedCity,
      selectCity: this.selectCity,
    };
  },
  mounted() {
    if (this.$route.query.city) {
      this.getBikewayData(this.$route.query.city);
    }
  },
};
</script>

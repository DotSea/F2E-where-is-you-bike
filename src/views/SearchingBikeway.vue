<template>
  <div class="container">
    <TheHeader class="header" />
    <router-view />
  </div>
  <Loading v-if="isLoading" />
</template>

<script>
import TheHeader from '../components/TheHeader.vue';
import Loading from '../components/LoadingPage.vue';

export default {
  name: 'FindingRoute',
  data() {
    return {
      selectedCity: '',
      bikewayData: '',
      isRouteSelected: '',
      isLoading: false,
    };
  },
  methods: {
    async getBikewayData(city) {
      this.isLoading = true;
      this.isRouteSelected = false;
      this.selectedCity = city;
      const res = await this.axiosInstance.get(`/Cycling/Shape/${city}`);
      this.bikewayData = res.data;
      await this.$router.push({
        name: 'BikewayList',
        params: { city, bikewayData: JSON.stringify(this.bikewayData) },
        query: { city },
      });
      this.isLoading = false;
    },
    selectRoute(index) {
      this.isRouteSelected = true;
      this.$router.push({
        name: 'BikewayMap',
        params: { routeData: JSON.stringify(this.bikewayData[index]) },
        query: { city: this.$route.query.city, id: index },
      });
    },
  },
  components: { TheHeader, Loading },
  provide() {
    return {
      selectRoute: this.selectRoute,
      isRouteSelected: () => this.isRouteSelected,
      selectedCity: () => this.selectedCity,
      getBikewayData: this.getBikewayData,
    };
  },
};
</script>

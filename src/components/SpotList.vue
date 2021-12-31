<template>
  <ul class="card-list">
    <li
      class="card-item"
      v-for="Spot in ListData"
      :key="Spot.ID"
      @click="selectRoute(Spot.ScenicSpotID || Spot.RestaurantID)"
    >
      <SpotCard :Spot-Data="Spot" />
    </li>
  </ul>
</template>

<script>
import SpotCard from './SpotCard.vue';

export default {
  name: 'SpotList',
  components: { SpotCard },
  data() {
    return {
      coordinate: { latitude: '', longitude: '' },
      isScenicSpotPage: true,
      ScenicSpot: '',
      Restaurant: '',
    };
  },
  methods: {
    async selectRoute(id) {
      this.$router.push({
        name: 'SpotInfo',
        params: { id },
      });
    },
  },
  computed: {
    ListData() {
      return this.isScenicSpotPage ? this.ScenicSpot : this.Restaurant;
    },
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // 找附近五公里內的景點
        const ScenicSpot = await this.axiosInstance.get(
          `/Tourism/ScenicSpot?%24top=30&%24spatialFilter=nearby(${position.coords.latitude}%2C%20${position.coords.longitude}%2C%203000)&%24format=JSON`,
        );
        // 找附近五公里內的美食
        const Restaurant = await this.axiosInstance.get(
          `/Tourism/Restaurant?%24top=30&%24spatialFilter=nearby(${position.coords.latitude}%2C%20${position.coords.longitude}%2C%203000)&%24format=JSON`,
        );
        this.ScenicSpot = ScenicSpot.data;
        this.Restaurant = Restaurant.data;
      });
    }
  },
  mounted() {
    this.eventBus.on('changeButton', (data) => {
      this.isScenicSpotPage = data;
    });
  },
};
</script>

<style>
img {
  width: 75px;
  height: 75px;
}
</style>

<template>
  <div class="map-title">{{ this.spotName }}</div>

  <div id="map" class="map"></div>
</template>

<script>
import L from 'leaflet';

export default {
  data() {
    return { map: '' };
  },
  methods: {
    setMap(latitude, longitude) {
      // 設置leaflet以及圖資
      this.map = L.map('map', { tap: false, zoomControl: false }).setView(
        [latitude, longitude],
        17,
      );
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 14,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: process.env.VUE_APP_MAPTOKEN,
        },
      ).addTo(this.map);

      L.marker([latitude, longitude]).addTo(this.map);
    },
  },
  props: ['position', 'spotName'],
  mounted() {
    this.setMap(this.position[0], this.position[1]);
    L.marker([this.position[0], this.position[1]]).addTo(this.map);
  },
};
</script>

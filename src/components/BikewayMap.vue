<template>
  <div class="map-title">{{ this.temp.RouteName }}</div>
  <div ref="mapElement" class="map"></div>
  <!-- {{ this.routeData ? JSON.parse(this.routeData) : '無' }} -->
</template>

<script>
import L from 'leaflet';
import Wkt from 'wicket';

const wicket = new Wkt.Wkt();
export default {
  name: 'BikewayMap',
  data() {
    return {
      temp: '',
      map: '',
    };
  },
  methods: {
    setMap(startCoord) {
      // 設置leaflet以及圖資
      this.map = L.map(this.$refs.mapElement, { zoomAnimation: false, tap: false }).setView(
        startCoord,
        16,
      );
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 14,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: process.env.VUE_APP_MAPTOKEN,
        },
      ).addTo(this.map);
    },
    polyLine(geo) {
      const geojsonFeature = wicket.read(geo).toJson();
      L.geoJSON(geojsonFeature).addTo(this.map);
    },
  },
  props: ['routeData'],
  mounted() {
    try {
      if (this.routeData) {
        this.temp = JSON.parse(this.routeData);
        const startCoord = [
          wicket.read(this.temp.Geometry).components[0][0].y,
          wicket.read(this.temp.Geometry).components[0][0].x,
        ];
        console.log(this.temp.RouteName);
        this.setMap(startCoord);
        console.log(this.$route);
        this.polyLine(this.temp.Geometry);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
<style lang="scss" scoped>
.map-title {
  width: 100%;
  text-align: center;
  position: absolute;
  z-index: 999;
  font-size: 16px;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>

<template>
  <div class="map-title">{{ this.temp.RouteName }}</div>
  <div ref="mapElement" class="map"></div>
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
      this.map = L.map(this.$refs.mapElement, { tap: false }).setView(startCoord, 16);
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
        this.setMap(startCoord);
        this.polyLine(this.temp.Geometry);
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

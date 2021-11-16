<template>
  <div id="map" class="map"></div>
  <input v-model="this.coordinate.latitude" />
  <input v-model="this.coordinate.longitude" />

  <button @click="backToCurrentLocation">附近</button>
</template>

<script>
/* eslint new-cap: ["error", { "newIsCap": false }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

import axios from 'axios';
import jsSHA from 'jssha';
import L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster/src';

export default {
  name: 'BikeMap',

  data() {
    return {
      mapboxToken: process.env.MAP_BOX_TOKEN,
      stationSVG:
        '<svg width="36" height="50" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 18.0726C0 8.09194 8.05911 0 17.9993 0C27.9409 0 36 8.09194 36 18.0726C36 26.8625 29.7496 34.1853 21.4692 35.8091L19.1796 42.1448C18.7795 43.2515 17.2205 43.2515 16.8204 42.1448L14.5308 35.8091C6.25038 34.1853 0 26.8625 0 18.0726ZM25.3249 47.8777C25.3249 49.0498 22.0451 50 17.9992 50C13.9534 50 10.6735 49.0498 10.6735 47.8777C10.6735 46.7055 13.9534 45.7553 17.9992 45.7553C22.0451 45.7553 25.3249 46.7055 25.3249 47.8777Z" fill="#FED801"/></svg>',
      iconSVG:
        '<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0.142857C2.95929 0.142857 0.5 2.60214 0.5 5.64286C0.5 9.76786 6 15.8571 6 15.8571C6 15.8571 11.5 9.76786 11.5 5.64286C11.5 2.60214 9.04071 0.142857 6 0.142857ZM6 7.60714C4.91571 7.60714 4.03571 6.72714 4.03571 5.64286C4.03571 4.55857 4.91571 3.67857 6 3.67857C7.08429 3.67857 7.96429 4.55857 7.96429 5.64286C7.96429 6.72714 7.08429 7.60714 6 7.60714Z" fill="black"/></svg>',
      map: '',
      dragDistance: {
        startCoord: [0, 0],
        endCoord: [0, 0],
      },
      coordinate: {
        latitude: '',
        longitude: '',
      },
      nearbyStationCoord: [],
    };
  },
  methods: {
    // init map
    setMap(latitude, longitude) {
      this.map = L.map('map', { zoomAnimation: false }).setView([latitude, longitude], 17);
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1,
          accessToken: process.env.VUE_APP_MAPTOKEN,
        },
      ).addTo(this.map);

      this.map.on('dragstart', () => {
        this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
      });
      this.map.on('dragend', () => {
        this.dragDistance.endCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
        const dragDistance = [
          this.dragDistance.startCoord[0] - this.dragDistance.endCoord[0],
          this.dragDistance.startCoord[1] - this.dragDistance.endCoord[1],
        ];
        if (dragDistance.some((item) => Math.abs(item) > 0.003)) {
          this.markers.clearLayers();
          this.getNearbyStation(this.dragDistance.endCoord[0], this.dragDistance.endCoord[1]);
        }
      });
    },
    // set user location
    setUserLocationMarker(latitude, longitude) {
      const iconSVG = '<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0.142857C2.95929 0.142857 0.5 2.60214 0.5 5.64286C0.5 9.76786 6 15.8571 6 15.8571C6 15.8571 11.5 9.76786 11.5 5.64286C11.5 2.60214 9.04071 0.142857 6 0.142857ZM6 7.60714C4.91571 7.60714 4.03571 6.72714 4.03571 5.64286C4.03571 4.55857 4.91571 3.67857 6 3.67857C7.08429 3.67857 7.96429 4.55857 7.96429 5.64286C7.96429 6.72714 7.08429 7.60714 6 7.60714Z" fill="black"/></svg>';
      const myicon = L.divIcon({
        html: iconSVG,
        className: '',
      });
      this.userMarker = new L.marker([latitude, longitude], { icon: myicon });
      this.circleMarker = new L.circleMarker([latitude, longitude], {
        radius: 30,
        color: '#fed801',
        opacity: 0.7,
        weight: 3,
        fill: true,
        fillOpacity: 0.1,
      });
      this.map.addLayer(this.userMarker);
      this.map.addLayer(this.circleMarker);
    },
    backToCurrentLocation() {
      this.map.setView([this.coordinate.latitude, this.coordinate.longitude], 17);
      this.getNearbyStation(this.coordinate.latitude, this.coordinate.longitude);
      this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
    },
    // set bike Station info
    async getNearbyStation(latitude, longitude) {
      try {
        // get nearby station info
        const stationInfo = await axios.get(
          `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$spatialFilter=nearby(${latitude}%2C%20${longitude}%2C1000)&$format=JSON`,
          { headers: this.authorizationHeader },
        );
        const stationData = stationInfo.data;
        // get nearby station current status
        const stationStatus = await axios.get(
          `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?$spatialFilter=nearby(${latitude}%2C%20${longitude}%2C1000)&$format=JSON`,
          { headers: this.authorizationHeader },
        );
        const availableData = stationStatus.data;
        availableData.forEach((availableItem) => {
          stationData.forEach((stationItem) => {
            if (availableItem.StationUID === stationItem.StationUID) {
              availableItem.StationName = stationItem.StationName;
              availableItem.StationAddress = stationItem.StationAddress;
              availableItem.StationPosition = stationItem.StationPosition;
            }
          });
        });
        // Some station doesn't have coordinate, need to exclude
        this.nearbyStationCoord = availableData.filter((item) => item.StationPosition);
        this.setStationMarker(this.nearbyStationCoord);
      } catch (e) {
        console.log(e);
      }
    },
    setMarkerCluster() {
      return new MarkerClusterGroup({
        iconCreateFunction(cluster) {
          return L.divIcon({ html: `<b>${cluster.getAllChildMarkers()}</b>` });
        },
      });
    },
    setStationMarker(nearbyStation) {
      nearbyStation.forEach((item) => {
        const coordinate = [item.StationPosition.PositionLat, item.StationPosition.PositionLon];
        const stationIcon = new L.divIcon({
          html: this.stationSVG,
          className: 'station-icon',
          iconAnchor: [18, 21],
        });
        const iconNum = new L.divIcon({
          html: `<p>${item.AvailableRentBikes}</p>`,
          className: 'icon-num',
          iconAnchor: [7, 12],
        });

        const popup = new L.popup({ className: 'station-popup' })
          .setLatLng(coordinate)
          .setContent(
            `<p>${item.StationName.Zh_tw}</p><p>可借車輛<span class="popup-number">${item.AvailableRentBikes}</span></p><p>可停空位<span class="popup-number">${item.AvailableReturnBikes}</span></p>`,
          );

        const stationMarker = (icon) => new L.marker(coordinate).setIcon(icon).bindPopup(popup);

        this.markers.addLayer(stationMarker(stationIcon));
        this.markers.addLayer(stationMarker(iconNum));
        this.map.addLayer(this.markers);
        console.log(item);
        console.log(item.StationName.Zh_tw);
        console.log('名稱', item.StationName.Zh_tw);
        console.log('可借車輛', item.AvailableRentBikes);
        console.log('可停空位', item.AvailableReturnBikes);
      });
    },
  },

  computed: {
    myicon() {
      return new L.divIcon({
        html: this.stationIcon,
        className: 'station-icon',
        iconAnchor: [18, 21],
      });
    },
    markers() {
      //   return new MarkerClusterGroup({
      //     iconCreateFunction(cluster) {
      //       console.log(cluster.getAllChildMarkers);
      //       return L.divIcon({ html: `<b>${cluster.getAllChildMarkers()})</b>` });
      //     },
      //   });
      return new L.layerGroup();
    },

    authorizationHeader() {
      const AppID = process.env.VUE_APP_API_ID;
      const AppKey = process.env.VUE_APP_API_KEY;
      const GMTString = new Date().toGMTString();
      const ShaObj = new jsSHA('SHA-1', 'TEXT');
      ShaObj.setHMACKey(AppKey, 'TEXT');
      ShaObj.update(`x-date: ${GMTString}`);
      const HMAC = ShaObj.getHMAC('B64');
      const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
      return { Authorization, 'X-Date': GMTString };
    },
  },
  watch: {
    coordinate: {
      deep: true,
      handler(newval) {
        this.map.removeLayer(this.userMarker);
        this.map.removeLayer(this.circleMarker);
        this.markers.clearLayers();
        this.setUserLocationMarker(newval.latitude, newval.longitude);
        this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
      },
    },
  },
  created() {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coordinate.latitude = position.coords.latitude;
          this.coordinate.longitude = position.coords.longitude;
          this.setMap(this.coordinate.latitude, this.coordinate.longitude);
          this.setUserLocationMarker(this.coordinate.latitude, this.coordinate.longitude);
          this.getNearbyStation(this.coordinate.latitude, this.coordinate.longitude);
          this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}

.test {
  color: #000000;
}
</style>
<style lang="scss">
.icon-num {
  font-family: Roboto;
  font-size: 15px;
  font-style: italic;
  font-weight: 900;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
}
.station-popup {
  font-family: Noto Sans TC;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  p {
    margin: 6px 0;
    .popup-number {
      //styleName: H3_EN;
      font-family: Roboto;
      font-size: 15px;
      font-style: italic;
      font-weight: 900;
      line-height: 20px;
      letter-spacing: 0em;
      text-align: center;
      margin-left: 11px;
    }
  }
}
</style>

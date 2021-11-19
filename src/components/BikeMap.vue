<template>
  <div id="map" class="map" @click.self="closeSearch">
    <div class="search">
      <div class="search-input">
        <input
          type="text"
          placeholder="尋找站點"
          @focus="openSearch"
          @keyup.enter="searchStation"
          @keyup.esc="closeSearch"
          v-model="this.stationKeyWord"
        />
        <SearchStation @click.stop="searchStation" class="search-button" />
      </div>
      <div v-if="this.searchResult.length !== 0 && isSearchResultOpen" class="search-result-list">
        <div
          class="search-item"
          @click="chooseStation(item)"
          v-for="(item, index) in searchResult"
          :key="index"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        v-else-if="this.searchResult.length === 0 && isSearchResultOpen"
        class="search-result-list"
      >
        <div class="search-item">查無此站，請輸入關鍵字</div>
      </div>
    </div>
    <button class="current-location" @click="backToCurrentLocation"><CurrentLocation /></button>
  </div>
</template>

<script>
/* eslint new-cap: ["error", { "newIsCap": false }] */
/* eslint no-param-reassign: ["error", { "props": false }] */

import axios from 'axios';
import jsSHA from 'jssha';
import L from 'leaflet';
import CurrentLocation from '../assets/svg/current-location.svg';
import SearchStation from '../assets/svg/search-station-mobile.svg';

export default {
  name: 'BikeMap',
  components: { CurrentLocation, SearchStation },
  data() {
    return {
      stationKeyWord: '',
      searchResult: [],
      isSearchResultOpen: false,
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
      isSelectRent: true,
    };
  },
  methods: {
    openSearch() {
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.isSearchResultOpen = true;
    },
    closeSearch() {
      this.isSearchResultOpen = false;
      this.map.dragging.enable();
      this.map.doubleClickZoom.enable();
      this.map.scrollWheelZoom.enable();
    },
    async chooseStation(station) {
      await this.map.setView([station.coordinate.PositionLat, station.coordinate.PositionLon], 17);
      await this.getNearbyStation(station.coordinate.PositionLat, station.coordinate.PositionLon);
      this.markers.eachLayer((marker) => {
        if (marker.options.id === station.stationUID) {
          marker.openPopup();
        }
      });
      this.closeSearch();
    },
    searchStation() {
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      if (this.stationKeyWord) {
        this.searchResult = [];
        this.cityName.forEach((city) => {
          axios
            .get(
              `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${city}?$filter=contains(StationName%2FZh_tw%2C%20'${this.stationKeyWord}')&$top=30&$format=JSON`,
              { headers: this.authorizationHeader },
            )
            .then((res) => {
              const stationNameList = res.data.map((item) => Object.values(item)[3].Zh_tw);
              const stationInfo = res.data.map((item) => {
                const info = {};
                [info.stationUID] = Object.values(item);
                [, , , , info.coordinate] = Object.values(item);
                info.name = Object.values(item)[3].Zh_tw;
                info.city = city;
                return info;
              });
              if (stationNameList.length !== 0) {
                this.searchResult.push(...stationInfo);
              }
            });
        });
      }
    },
    // init map
    setMap(latitude, longitude) {
      this.map = L.map('map', { zoomAnimation: false }).setView([latitude, longitude], 17);
      L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 15,
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
      this.markers.clearLayers();
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

    setStationMarker(nearbyStation) {
      nearbyStation.forEach((item) => {
        const coord = [item.StationPosition.PositionLat, item.StationPosition.PositionLon];
        const stationIcon = new L.divIcon({
          html: this.stationSVG,
          className: `${this.isSelectRent ? 'station-icon' : 'station-icon-parking'}`,
          iconAnchor: [18, 21],
        });
        const iconNum = new L.divIcon({
          html: `<p>${this.isSelectRent ? item.AvailableRentBikes : item.AvailableReturnBikes}</p>`,
          className: `${this.isSelectRent ? 'icon-num' : 'icon-num-parking'}`,
          iconAnchor: [7, 12],
        });

        const pop = new L.popup({ className: 'station-popup', offset: [0, -8] })
          .setLatLng(coord)
          .setContent(
            `<p>${item.StationName.Zh_tw}</p><p>可借車輛<span class="popup-number">${item.AvailableRentBikes}</span></p><p>可停空位<span class="popup-number">${item.AvailableReturnBikes}</span></p>`,
          );

        const marker = (icon) => new L.marker(coord, { id: item.StationUID }).setIcon(icon);
        this.markers.addLayer(marker(stationIcon).bindPopup(pop).openPopup());
        this.markers.addLayer(marker(iconNum).bindPopup(pop).openPopup());
        this.markers.addTo(this.map);
      });
    },
  },

  computed: {
    cityName() {
      return [
        'Taipei',
        'NewTaipei',
        'Taoyuan',
        'Hsinchu',
        'MiaoliCounty',
        'Taichung',
        'Chiayi',
        'Tainan',
        'Kaohsiung',
        'PingtungCounty',
        'KinmenCounty',
      ];
    },
    markers() {
      return new L.featureGroup();
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
    stationKeyWord(newval) {
      this.searchResult = [];
      if (!newval) {
        this.isSearchResultOpen = false;
      } else {
        this.isSearchResultOpen = true;
      }
    },
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
  mounted() {
    this.eventBus.on('changeButton', (data) => {
      this.isSelectRent = data;
      this.setStationMarker(this.nearbyStationCoord);
    });
  },
  beforeUnmount() {
    this.eventBus.off('changeButton');
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
.search {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  position: absolute;
  top: 4.5%;
  left: 50%;
  z-index: 500;
  max-height: calc(80vh - 140px);

  transform: translate(-50%, 0%);
  .search-input {
    display: flex;
    input {
      background: #ffffff;
      min-width: 50vw;
      box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 8px;
      padding-right: 16px;
      padding-left: 8px;
      font-size: 16px;
      line-height: 16px;
    }
    .search-button {
      display: block;
      cursor: pointer;
      height: 45px;
    }
  }
  .search-result-list {
    z-index: 999;
    margin-top: 5px;
    background: #ffffff;
    padding: 5px;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow-y: scroll;

    .search-item {
      background: #ffffff;
      box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 5px;
      padding: 5px;
      font-size: 14px;
      text-align: left;
      &:hover {
        background: #fed801;
      }
    }
  }
}
.current-location {
  position: absolute;
  bottom: 7.5%;
  right: 16px;
  background: transparent;
  transform: translate(0%, 50%);
  z-index: 500;
}
</style>
<style lang="scss">
.icon-num {
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-style: italic;
  font-weight: 900;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
}
.icon-num-parking {
  color: #fed801;
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  font-style: italic;
  font-weight: 900;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
}
.station-icon-parking {
  svg {
    path {
      fill: #000;
    }
  }
}
.station-popup {
  font-family: 'Noto Sans CJK TC';
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  p {
    margin: 6px 0;
    .popup-number {
      font-family: 'Roboto', sans-serif;
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

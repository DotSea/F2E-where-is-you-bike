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
  <LoadingPage v-if="isLoading" />
</template>

<script>
/* eslint new-cap: ["error", { "newIsCap": false }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import axios from 'axios';
import jsSHA from 'jssha';
import L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster/src';
import CurrentLocation from '../assets/svg/current-location.svg';
import SearchStation from '../assets/svg/search-station-mobile.svg';
import LoadingPage from './LoadingPage.vue';

const authorizationHeader = () => {
  const AppID = process.env.VUE_APP_API_ID;
  const AppKey = process.env.VUE_APP_API_KEY;
  const GMTString = new Date().toGMTString();
  const ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update(`x-date: ${GMTString}`);
  const HMAC = ShaObj.getHMAC('B64');
  const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`;
  return { Authorization, 'X-Date': GMTString };
};

const axiosInstance = axios.create({
  baseURL: 'https://ptx.transportdata.tw/MOTC/v2/Bike',
  headers: authorizationHeader(),
});

export default {
  name: 'BikeMap',
  components: { CurrentLocation, SearchStation, LoadingPage },
  data() {
    return {
      isLoading: false,
      stationKeyWord: '',
      searchResult: [],
      isSearchResultOpen: false,
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
      this.setStationMarker(this.nearbyStationCoord);
      this.closeSearch();
      this.markers.eachLayer((marker) => {
        if (marker.options.id === station.stationUID) {
          const stationInView = this.markers.getVisibleParent(marker);
          // 沒有id，代表仍為cluster的型態，需要展開cluster
          if (!stationInView.options.id) {
            stationInView.spiderfy();
          }
          marker.openPopup();
        }
      });
    },
    searchStation() {
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      if (this.stationKeyWord) {
        this.searchResult = [];
        this.cityName.forEach(async (city) => {
          const res = await axiosInstance.get(
            `Station/${city}?$filter=contains(StationName%2FZh_tw%2C%20'${this.stationKeyWord}')&$top=30&$format=JSON`,
          );
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
      }
    },
    // init map
    setMap(latitude, longitude) {
      // 設置leaflet以及圖資
      this.map = L.map('map', { zoomAnimation: false, tap: false });

      this.map.setView([latitude, longitude], 17);

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
      this.calculateDragDistanceOfMap();
    },
    // 記錄地圖拖曳的起迄點，如果起訖點的經度或緯度相差超過0.003，則重新顯示迄點的附近站牌
    calculateDragDistanceOfMap() {
      this.map.on('dragstart', () => {
        this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
      });
      this.map.on('dragend', async () => {
        this.dragDistance.endCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
        const dragDistance = [
          this.dragDistance.startCoord[0] - this.dragDistance.endCoord[0],
          this.dragDistance.startCoord[1] - this.dragDistance.endCoord[1],
        ];
        if (dragDistance.some((item) => Math.abs(item) > 0.003)) {
          await this.getNearbyStation(this.dragDistance.endCoord[0], this.dragDistance.endCoord[1]);
          this.setStationMarker(this.nearbyStationCoord);
        }
      });
    },
    // 設置user位置的marker
    setUserLocationMarker(latitude, longitude) {
      const GPS = '<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 0.142857C2.95929 0.142857 0.5 2.60214 0.5 5.64286C0.5 9.76786 6 15.8571 6 15.8571C6 15.8571 11.5 9.76786 11.5 5.64286C11.5 2.60214 9.04071 0.142857 6 0.142857ZM6 7.60714C4.91571 7.60714 4.03571 6.72714 4.03571 5.64286C4.03571 4.55857 4.91571 3.67857 6 3.67857C7.08429 3.67857 7.96429 4.55857 7.96429 5.64286C7.96429 6.72714 7.08429 7.60714 6 7.60714Z" fill="white"/></svg>';

      const myicon = L.divIcon({
        html: GPS,
        className: 'GPS',
      });
      const circleIcon = L.divIcon({
        html: '',
        className: 'radar-animation',
      });
      /// 兩種marker
      this.userMarker = new L.marker([latitude, longitude], { icon: myicon });
      this.circleMarker = new L.marker([latitude, longitude], { icon: circleIcon });
      /// 將user marker加入地圖
      this.map.addLayer(this.circleMarker);
      this.map.addLayer(this.userMarker);
    },
    // 回到使用者目前位置
    async backToCurrentLocation() {
      this.map.setView([this.coordinate.latitude, this.coordinate.longitude], 17);
      /// 重新取得使用者位置附近站點資訊
      await this.getNearbyStation(this.coordinate.latitude, this.coordinate.longitude);
      this.setStationMarker(this.nearbyStationCoord);
      this.dragDistance.startCoord = [this.coordinate.latitude, this.coordinate.longitude];
    },
    // 取得附近站點資訊
    async getNearbyStation(latitude, longitude) {
      try {
        /// 取得附近方圓一公里內站點名稱等基本資料
        const stationInfo = await axiosInstance.get(
          `/Station/NearBy?$spatialFilter=nearby(${latitude}%2C%20${longitude}%2C1000)&$format=JSON`,
        );
        const infoData = stationInfo.data;
        ///  取得附近方圓一公里內站點可借車輛/剩餘車位數等狀態
        const stationStatus = await axiosInstance.get(
          `/Availability/NearBy?$spatialFilter=nearby(${latitude}%2C%20${longitude}%2C1000)&$format=JSON`,
        );
        /// 兩種資料比對：若UID相同，則合併，以便後續資料處理
        const statusData = stationStatus.data;
        statusData.forEach((statusItem) => {
          infoData.forEach((infoItem) => {
            if (statusItem.StationUID === infoItem.StationUID) {
              statusItem.StationName = infoItem.StationName;
              statusItem.StationAddress = infoItem.StationAddress;
              statusItem.StationPosition = infoItem.StationPosition;
            }
          });
        });
        // Some station doesn't have coordinate, need to exclude
        this.nearbyStationCoord = statusData.filter((item) => item.StationPosition);
      } catch (e) {
        console.log(e);
      }
    },
    // 設置站牌的marker
    setStationMarker(nearbyStation) {
      this.markers.clearLayers(); /// 清除原本的站點marker
      nearbyStation.forEach((item) => {
        const coord = [item.StationPosition.PositionLat, item.StationPosition.PositionLon];
        const stationIcon = new L.divIcon({
          html: `<div class='station-marker ${
            this.isSelectRent ? 'station-renting' : 'station-parking'
          }'>${this.isSelectRent ? item.AvailableRentBikes : item.AvailableReturnBikes}</div>`,
          iconAnchor: [7, 12],
          className: 'no-shadow',
        });
        const pop = new L.popup({ className: 'station-popup', offset: [7, 12] })
          .setLatLng(coord)
          .setContent(
            `<p>${item.StationName.Zh_tw}</p><p>可借車輛<span class="popup-number">${item.AvailableRentBikes}</span></p><p>可停空位<span class="popup-number">${item.AvailableReturnBikes}</span></p>`,
          );
        const marker = (icon) => new L.marker(coord, { id: item.StationUID }).setIcon(icon);
        this.markers.addLayer(marker(stationIcon).bindPopup(pop).openPopup());
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
      // bug: 切換租還車時無法清除原本站點icon
      return new MarkerClusterGroup({ spiderfyOnMaxZoom: true });
    },
  },
  watch: {
    stationKeyWord(newval) {
      /// 鍵入站點關鍵字時，清空搜尋結果
      this.searchResult = [];
      if (!newval) {
        /// 若關鍵字為空時，關閉搜尋模式，否則則開啟
        this.isSearchResultOpen = false;
      } else {
        this.isSearchResultOpen = true;
      }
    },
    coordinate: {
      deep: true,
      async handler(newval) {
        this.map.removeLayer(this.userMarker);
        this.setUserLocationMarker(newval.latitude, newval.longitude);
        await this.getNearbyStation(this.coordinate.latitude, this.coordinate.longitude);
        this.setStationMarker(this.nearbyStationCoord);
        this.dragDistance.startCoord = [this.map.getCenter().lat, this.map.getCenter().lng];
      },
    },
  },

  created() {
    try {
      if (navigator.geolocation) {
        this.isLoading = true;
        navigator.geolocation.getCurrentPosition(async (position) => {
          //  取得使用者目前位置，並儲存使用者位置座標
          this.coordinate.latitude = position.coords.latitude;
          this.coordinate.longitude = position.coords.longitude;
          // 設置leaflet以及圖資
          this.setMap(this.coordinate.latitude, this.coordinate.longitude);
          // 設置user位置的icon
          this.setUserLocationMarker(this.coordinate.latitude, this.coordinate.longitude);
          // 向TDX取得附近站點的資料
          await this.getNearbyStation(this.coordinate.latitude, this.coordinate.longitude);
          // 設置站點的marker
          this.setStationMarker(this.nearbyStationCoord);
          // 將 user位置設為拖曳點的起始座標
          this.dragDistance.startCoord = [this.coordinate.latitude, this.coordinate.longitude];
          this.isLoading = false;
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

<style lang="scss">
@import '../assets/css/components/station-marker.scss';
</style>

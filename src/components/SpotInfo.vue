<template>
  <div class="info-container">
    <div class="info-picture">
      <img
        :src="this.pictureInfo.PictureUrl1 || require('../assets/no-image-available.webp')"
        :alt="this.pictureInfo.PictureDescription1"
      />
    </div>
    <div class="info-detail">
      <div class="open-time">
        <TimeIcon />
        <span>{{ this.SpotInfo.OpenTime }}</span>
      </div>
      <div class="phone-number">
        <PhoneIcon />
        <span>{{ this.SpotInfo.Phone }}</span>
      </div>
      <div class="address">
        <LocationIcon />
        <span>{{ this.SpotInfo.Address }}</span>
        <button type="button" class="map-button" @click="goToPage(this.id)">地圖</button>
      </div>
      <div class="description">
        {{ this.SpotInfo.DescriptionDetail || this.SpotInfo.Description }}
      </div>
    </div>
  </div>
</template>

<script>
import TimeIcon from '../assets/svg/open-time.svg';
import PhoneIcon from '../assets/svg/phone.svg';
import LocationIcon from '../assets/svg/location.svg';

export default {
  name: 'SpotInfo',
  data() {
    return { SpotInfo: '', pictureInfo: '' };
  },
  methods: {
    goToPage(id) {
      this.$router.push({
        name: 'SpotMap',
        params: { id },
        query: {
          spotName: this.SpotInfo.ScenicSpotName || this.SpotInfo.RestaurantName,
          lat: this.SpotInfo.Position.PositionLat,
          lon: this.SpotInfo.Position.PositionLon,
        },
      });
    },
  },
  components: { TimeIcon, PhoneIcon, LocationIcon },
  props: ['id'],
  async mounted() {
    const isScenicSpot = this.id.slice(0, 2) === 'C1' ? 'ScenicSpot' : 'Restaurant';

    const res = await this.axiosInstance.get(
      `/Tourism/${isScenicSpot}?%24filter=(${isScenicSpot}ID%20eq%20%27${this.id}%27)&%24format=JSON`,
    );
    [this.SpotInfo] = res.data;
    this.pictureInfo = this.SpotInfo.Picture;
  },
};
</script>

<style lang="scss" scoped>
$width: 75vw;
$max-width: 500px;
.info-container {
  padding: 23px;
  width: fit-content;
  width: -moz-fit-content;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .info-picture {
    margin: 0 auto;
    background: white;
    box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    img {
      margin: 22px 18.67px;
      width: $width;
      height: $width/1.5;
      max-width: $max-width;
      max-height: $max-width/1.5;
    }
  }
  .info-detail {
    width: calc(#{$width} + 37.34px);
    max-width: calc(#{$max-width} + 37.34px);
    padding-left: 10px;
    padding-right: 10px;
    font-size: 13px;
    line-height: 150%;
    display: flex;
    flex-direction: column;
    text-align: left;
    & > * {
      margin-top: 20px;
    }
    span {
      margin: 0 0.5rem;
    }
    .address {
      display: flex;
      .map-button {
        background: #fed801;
        border-radius: 16px;
      }
    }
    .description {
      color: #7a7a7a;
    }
  }
}
</style>

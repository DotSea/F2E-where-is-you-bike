<template>
  <div class="info-container">
    <div class="info-picture">
      <img
        v-if="this.pictureInfo.PictureUrl1"
        :src="this.pictureInfo.PictureUrl1"
        :alt="this.pictureInfo.PictureDescription1"
      />
      <NoImage v-else />
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
import NoImage from '../assets/svg/no-image-rectangle.svg';

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
  components: {
    TimeIcon,
    PhoneIcon,
    LocationIcon,
    NoImage,
  },
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

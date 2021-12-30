<template>
  <img
    class="spot-picture"
    :src="SpotData.Picture.PictureUrl1 || require('../assets/no-image-available.webp')"
    :alt="SpotData.Picture.PictureDescription1"
  />

  <div class="spot-info">
    <div class="name">{{ SpotData.ScenicSpotName || SpotData.RestaurantName }}</div>
    <div class="phone-number"><PhoneIcon /> {{ SpotData.Phone }}</div>
  </div>
  <div class="spot-distance">距離五公里內</div>
</template>

<script>
import PhoneIcon from '../assets/svg/phone.svg';

export default {
  components: { PhoneIcon },
  props: ['SpotData'],
  mounted() {},
};
</script>
<style lang="scss" scoped></style>

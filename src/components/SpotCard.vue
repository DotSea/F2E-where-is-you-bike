<template>
  <img
    v-if="SpotData.Picture.PictureUrl1"
    class="spot-picture"
    :src="SpotData.Picture.PictureUrl1"
    :alt="SpotData.Picture.PictureDescription1"
  />
  <NoImage v-else class="spot-picture" />
  <div class="spot-info">
    <div class="name">{{ SpotData.ScenicSpotName || SpotData.RestaurantName }}</div>
    <div class="phone-number"><PhoneIcon /> {{ SpotData.Phone }}</div>
  </div>
  <div class="spot-distance">距離五公里內</div>
</template>

<script>
import PhoneIcon from '../assets/svg/phone.svg';
import NoImage from '../assets/svg/no-image-square.svg';

export default {
  components: { PhoneIcon, NoImage },
  props: ['SpotData'],
  mounted() {},
};
</script>
<style lang="scss" scoped></style>

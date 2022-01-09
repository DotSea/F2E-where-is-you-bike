<template>
  <div class="switcher">
    <button
      @click="selectButton"
      :class="{ 'switcher-btn': true, 'focus-type': this.isSelectLeftButton }"
    >
      <RentBike v-if="this.isBikeMapPage" :class="{ 'focus-icon-rent': this.isSelectLeftButton }" />
      <AttractionIcon v-else :class="{ 'focus-icon-rent': this.isSelectLeftButton }" />
      <p>{{ this.isBikeMapPage ? '租車' : '景點' }}</p>
    </button>
    <button
      @click="selectButton"
      :class="{ 'switcher-btn': true, 'focus-type': !this.isSelectLeftButton }"
    >
      <ParkingBike
        v-if="this.isBikeMapPage"
        :class="{ 'focus-icon-parking': !this.isSelectLeftButton }"
      />
      <FoodIcon v-else :class="{ 'focus-icon-parking': !this.isSelectLeftButton }" />
      <p>{{ this.isBikeMapPage ? '還車' : '美食' }}</p>
    </button>
  </div>
</template>

<script>
import RentBike from '../assets/svg/rent-bike.svg';
import ParkingBike from '../assets/svg/parking-bike.svg';
import AttractionIcon from '../assets/svg/attraction.svg';
import FoodIcon from '../assets/svg/food.svg';

export default {
  name: 'TheFooter',
  data() {
    return { isSelectLeftButton: true };
  },
  components: {
    RentBike,
    ParkingBike,
    AttractionIcon,
    FoodIcon,
  },
  computed: {
    isBikeMapPage() {
      return this.$route.name === 'FindingBike';
    },
  },
  methods: {
    selectButton() {
      this.isSelectLeftButton = !this.isSelectLeftButton;
      this.eventBus.emit('changeButton', this.isSelectLeftButton);
    },
  },
};
</script>

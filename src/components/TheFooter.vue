<template>
  <div class="footer bg-yellow">
    <button
      @click="selectButton"
      :class="{ btn: true, 'rent-bike': true, 'focus-type': this.isSelectRent }"
    >
      <RentBike :class="{ icon: true, 'focus-icon-rent': this.isSelectRent }" />
      <p>租車</p>
    </button>
    <button
      @click="selectButton"
      :class="{ btn: true, 'parking-bike': true, 'focus-type': !this.isSelectRent }"
    >
      <ParkingBike :class="{ icon: true, 'focus-icon-parking': !this.isSelectRent }" />
      <p>還車</p>
    </button>
  </div>
</template>

<script>
import RentBike from '../assets/svg/rent-bike.svg';
import ParkingBike from '../assets/svg/parking-bike.svg';

export default {
  name: 'TheFooter',
  data() {
    return { isSelectRent: true };
  },
  components: { RentBike, ParkingBike },
  methods: {
    selectButton() {
      this.isSelectRent = !this.isSelectRent;
      this.eventBus.emit('changeButton', this.isSelectRent);
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  p {
    margin-left: 10px;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 64px;
    letter-spacing: 1em;
  }
}

.focus-type {
  color: #ffffff;
}
</style>
<style lang="scss">
.focus-icon-rent {
  path {
    fill: #ffffff;
  }
}
.focus-icon-parking {
  path {
    fill: #fed801;
  }
  rect {
    fill: white;
  }
}
</style>

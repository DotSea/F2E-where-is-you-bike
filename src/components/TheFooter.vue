<template>
  <div class="footer bg-yellow">
    <button class="btn rent-bike">
      <RentBike class="icon" />
      <p>租車</p>
    </button>
    <button class="btn parking-bike">
      <ParkingBike class="icon" />
      <p>還車</p>
    </button>
  </div>
</template>

<script>
import RentBike from '../assets/svg/rent-bike.svg';
import ParkingBike from '../assets/svg/parking-bike.svg';

export default {
  name: 'TheFooter',
  components: { RentBike, ParkingBike },
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
    font-family: Noto Sans TC;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 64px;
    letter-spacing: 1em;
  }
}
</style>

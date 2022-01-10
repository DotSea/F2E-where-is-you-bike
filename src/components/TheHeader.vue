<template>
  <div class="header bg-yellow">
    <button @click="backToPreviousPage" class="back-to-previous-page"><GoBack /></button>
    <button @click="backToHome" class="back-to-home"><BackToHome /></button>
    <div class="switcher-in-desktop">
      <CategorySwitcher v-if="this.isSpotListPage || this.isFindingBikePage" />
    </div>

    <TheSelector v-if="this.isBikewayListPage" />
  </div>
</template>

<script>
import GoBack from '../assets/svg/back.svg';
import BackToHome from '../assets/svg/logo.svg';
import TheSelector from './CitySelector.vue';
import CategorySwitcher from './CategorySwitcher.vue';

export default {
  name: 'TheHeader',
  components: {
    GoBack,
    BackToHome,
    TheSelector,
    CategorySwitcher,
  },
  computed: {
    isBikewayListPage() {
      //   return this.$route.path.match(/bikeway/);
      return this.$route.name === 'BikewayList';
    },
    isSpotListPage() {
      return this.$route.name === 'SpotList';
    },
    isFindingBikePage() {
      return this.$route.name === 'FindingBike';
    },
  },
  methods: {
    backToPreviousPage() {
      const { fullPath } = this.$route;
      const slicePosition = Math.max(
        fullPath.lastIndexOf('/'),
        fullPath.lastIndexOf('&'),
        fullPath.lastIndexOf('?'),
      );
      const afterSlice = fullPath.slice(0, slicePosition);
      if (this.$route.name === 'SpotMap') {
        this.$router.push({ name: 'SpotInfo' });
      } else {
        this.$router.push(slicePosition === 0 ? '/' : afterSlice);
      }
    },
    backToHome() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

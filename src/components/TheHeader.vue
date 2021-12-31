<template>
  <div class="header bg-yellow">
    <button @click="backToPreviousPage" class="back-to-home"><BackToHome /></button>
    <div class="switcher-in-desktop">
      <CategorySwitcher />
    </div>

    <TheSelector v-if="this.$route.path.match(/bikeway/) && this.$route.name !== 'BikewayMap'" />
  </div>
</template>

<script>
import BackToHome from '../assets/svg/back.svg';
import TheSelector from './CitySelector.vue';
import CategorySwitcher from './CategorySwitcher.vue';

export default {
  name: 'TheHeader',
  components: { BackToHome, TheSelector, CategorySwitcher },
  data() {
    return {};
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
  },
};
</script>

<style lang="scss" scoped></style>

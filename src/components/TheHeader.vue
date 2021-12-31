<template>
  <div class="header bg-yellow">
    <button @click="backToPreviousPage" class="back-to-home"><BackToHome /></button>
    <TheSelector v-if="this.$route.path.match(/bikeway/) && this.$route.name !== 'BikewayMap'" />
  </div>
</template>

<script>
import BackToHome from '../assets/svg/back.svg';
import TheSelector from './TheSelector.vue';

export default {
  name: 'TheHeader',
  components: { BackToHome, TheSelector },
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
      //   if (this.$route.query.id) {

      //     this.$router.push({ name: 'SearchingBikeway', query:
      // { city: this.$route.query.city } });
      //     this.$router.go();
      //   } else if (this.$route.query.city) {
      //     this.$router.push({ name: 'SearchingBikeway' });
      //   } else {
      //     this.$router.push({ name: 'Home' });
      //   }
    },
  },
};
</script>

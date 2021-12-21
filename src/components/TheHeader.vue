<template>
  <div class="header bg-yellow">
    <button @click="backToPreviousPage" class="back-to-home"><BackToHome /></button>
    <TheSelector v-if="this.$route.path.match(/bikeway/)" />
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
      if (this.$route.query.city) {
        this.$router.push({ name: 'SearchingBikeway' });
      } else {
        this.$router.push({ name: 'Home' });
      }
    },
  },
  mounted() {
    console.log(this.$route.query);
  },
};
</script>

<template>
  <div class="header bg-yellow">
    <router-link to="/"
      ><button class="back-to-home"><BackToHome /></button>
    </router-link>
  </div>
</template>

<script>
import BackToHome from '../assets/svg/back.svg';

export default {
  name: 'TheHeader',
  components: { BackToHome },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back-to-home {
  height: 64px;
  background: inherit;
  justify-content: center;
  text-align: center;
  align-items: center;
  cursor: pointer;
  padding-left: 24px;
  padding-right: 24px;
}
</style>

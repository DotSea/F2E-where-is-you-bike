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

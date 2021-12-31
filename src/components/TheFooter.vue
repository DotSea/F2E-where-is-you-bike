<template>
  <div class="footer bg-yellow">
    <div class="switcher-in-mobile-and-tablet">
      <CategorySwitcher />
    </div>
  </div>
</template>

<script>
import CategorySwitcher from './CategorySwitcher.vue';

export default {
  name: 'TheFooter',
  components: { CategorySwitcher },
};
</script>

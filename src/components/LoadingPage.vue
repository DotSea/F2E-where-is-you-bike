<template>
  <div class="lightbox">
    <teleport to="body">
      <div class="modal-mask">
        <div class="modal-body">
          <div ref="youbikeIcon"></div>
        </div>
      </div>
    </teleport>
  </div>
</template>
<script>
import lottie from 'lottie-web';
import jsonData from '../assets/svg/youbike.json';

export default {
  mounted() {
    lottie.loadAnimation({
      container: this.$refs.youbikeIcon, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jsonData, // the path to the animation json
    });
  },
  beforeUnmount() {
    lottie.destroy();
  },
};
</script>
<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-body {
  text-align: center;

  margin-top: -40%;
}
</style>

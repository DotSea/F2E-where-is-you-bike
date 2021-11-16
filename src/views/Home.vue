<template>
  <div class="home bg-yellow">
    <div class="container">
      <div class="title">
        <TheBike />
        <TheLogo class="logo" />
        <p>微笑單車．暢遊城市</p>
      </div>
      <div class="button-group">
        <router-link to="/bike"> <button>尋找Youbike</button></router-link>
        <button>查詢自行車道</button>
        <button>附近景點、美食</button>
      </div>
      <div class="footer">Where’s YouBike © Code: DotSea / Design: KT</div>
    </div>
  </div>
</template>

<script>
import TheLogo from '../assets/svg/logo.svg';
import TheBike from '../assets/svg/bike.svg';

export default {
  name: 'Home',
  components: { TheLogo, TheBike },
};
</script>

<style lang="scss" scoped>
.container {
  overflow-x: scroll;
  height: 100vh;
  padding-right: 58px;
  padding-left: 58px;
  padding-bottom: 20px;
  padding-top: 22vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 19px;
  letter-spacing: 0.92em;
}
.button-group {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
button {
  width: 244px;
  margin: 10px;
  padding: 12px;
  border: 2px solid #000000;
  border-radius: 10px;
  font-family: Noto Sans TC;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
}
.footer {
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
}
</style>

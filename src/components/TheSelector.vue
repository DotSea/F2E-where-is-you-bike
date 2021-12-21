<template>
  <!-- Reference by : https://qvault.io/javascript/custom-select-component-in-vue/ -->
  <div class="custom-select" @blur="isSelectorOpen = false">
    <div
      class="selected"
      :class="{ open: isSelectorOpen }"
      @click="isSelectorOpen = !isSelectorOpen"
    >
      {{ this.selected || '請選擇城市' }}
    </div>
    <div class="options" :class="{ selectHide: !isSelectorOpen }">
      <div
        class="option-item"
        v-for="(cityZhName, cityEnName) in citys"
        :key="cityEnName"
        @click="
          this.isSelectorOpen = false;
          this.selected = cityZhName;
          this.selectCity(cityEnName);
        "
      >
        {{ cityZhName }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: '',
      isSelectorOpen: false,
    };
  },

  computed: {
    citys() {
      return {
        Keelung: '基隆市',
        Taipei: '臺北市',
        NewTaipei: '新北市',
        Taoyuan: '桃園市',
        HsinchuCounty: '新竹縣',
        MiaoliCounty: '苗栗縣',
        Taichung: '臺中市',
        ChanghuaCounty: '彰化縣',
        NantouCounty: '南投縣',
        YunlinCounty: '雲林縣',
        ChiayiCounty: '嘉義縣',
        Chiayi: '嘉義市',
        Tainan: '臺南市',
        Kaohsiung: '高雄市',
        PingtungCounty: '屏東縣',
        YilanCounty: '宜蘭縣',
        HualienCounty: '花蓮縣',
        TaitungCounty: '臺東縣',
        PenghuCounty: '澎湖縣',
        KinmenCounty: '金門縣',
        LienchiangCounty: '連江縣',
      };
    },
  },
  inject: ['selectCity'],
  mounted() {
    const city = Object.keys(this.citys).find((item) => item === this.$route.query.city);
    this.selected = this.citys[city] || '請選擇城市';
  },
};
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  min-width: 40%;
  max-width: 143px;
  margin-right: 20px;
  text-align: left;

  height: 47px;
  line-height: 47px;
  .selected {
    background-color: #0a0a0a;
    border-radius: 31px;
    border: 1px solid #666666;
    color: #fff;
    padding-left: 1em;
    cursor: pointer;
    user-select: none;
    &:after {
      position: absolute;
      content: '';
      top: 22px;
      right: 1em;
      width: 0;
      height: 0;
      color: white;
      border: 5px solid transparent;
      border-color: #fff transparent transparent transparent;
    }
    &.open {
      border: none;
      border-radius: 25px 25px 0px 0px;
    }
  }

  .options {
    color: #fff;
    border-radius: 0px 0px 31px 31px;
    height: 90vh;
    overflow-y: auto;
    border: none;
    position: absolute;
    background-color: #0a0a0a;
    left: 0;
    right: 0;
    z-index: 999;
    .option-item {
      color: #fff;
      padding-left: 1em;
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: darken(#fed801, 5%);
        color: black;
      }
    }
  }
}
.selectHide {
  display: none;
}
</style>

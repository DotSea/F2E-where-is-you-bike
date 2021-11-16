<template>
  <router-view />
</template>

<style lang="scss">
@import 'reset-css';
@import './assets/css/base.scss';
@import '../node_modules/leaflet/dist/leaflet.css';
@import '../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

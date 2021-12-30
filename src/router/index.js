import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import FindingBike from '../views/FindingBike.vue';
import SearchingBikeway from '../views/SearchingBikeway.vue';
import BikewayList from '../components/BikewayList.vue';
import BikewayMap from '../components/BikewayMap.vue';
import NearbyTouristSpot from '../views/NearbyTouristSpot.vue';
import SpotList from '../components/SpotList.vue';
import SpotInfo from '../components/SpotInfo.vue';
import SpotMap from '../components/SpotMap.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/bike',
    name: 'FindingBike',
    component: FindingBike,
  },

  {
    path: '/bikeway',

    name: 'SearchingBikeway',
    component: SearchingBikeway,
    children: [
      {
        name: 'BikewayList',
        path: '',
        component: BikewayList,
        props: (route) => ({ bikewayData: route.params.bikewayData }),
      },
      {
        name: 'BikewayMap',
        path: '',
        component: BikewayMap,
        props: (route) => ({
          routeData: route.params.routeData,
        }),
      },
    ],
  },
  {
    path: '/tourism',
    name: 'NearbyTouristSpot',
    component: NearbyTouristSpot,
    children: [
      {
        name: 'SpotList',
        path: '',
        component: SpotList,
      },
      {
        name: 'SpotInfo',
        path: ':id',
        props: (route) => ({ Id: route.params.id }),
        component: SpotInfo,
      },
      {
        name: 'SpotMap',
        path: '/map',
        component: SpotMap,
        props: (route) => ({
          position: [route.query.lat, route.query.lon],
          spotName: route.query.spotName,
        }),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

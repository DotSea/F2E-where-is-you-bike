import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import FindingBike from '../views/FindingBike.vue';
import SearchingBikeway from '../views/SearchingBikeway.vue';
import BikewayList from '../components/BikewayList.vue';
import BikewayMap from '../components/BikewayMap.vue';

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
        props: (route) => ({ bikewayData: route.params.bikewayData, city: route.query.city }),
      },
      {
        name: 'BikewayMap',
        path: '',
        component: BikewayMap,
        props: (route) => ({
          routeData: route.params.routeData,
          city: route.query.city,
          id: route.query.id,
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

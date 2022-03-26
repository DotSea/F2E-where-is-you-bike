# where is youbike

## 作品說明

與設計師 [K.T](https://www.behance.net/gallery/131133281/YouBike-Map-Project) 合作完成之作品，透過介接[交通部 TDX API](https://tdx.transportdata.tw/)，提供使用者查詢公共自行車相關資訊。可查詢附近公共自行車站點可借車輛/可停空位等即時資訊，並可搜尋特定站點名稱；可查詢各縣市自行車道，並展示具體位置。除公共自行車外，亦整合了觀光旅遊景點等資訊，使用者可瀏覽附近觀光景點/美食餐廳，並掌握特定景點的詳細資訊與具體位置。

## Demo

<p>
  Demo：<a  href="https://dyfu95.github.io/F2E-where-is-you-bike/#/bike">where is youbike</a>
</p>

## 使用技術

- 使用 [Vue.js](https://vuejs.org/) 搭配 [Vue CLI](https://cli.vuejs.org/) 建立前端頁面
- 使用 [Vue Router](https://router.vuejs.org/) 建立動態及巢狀路由。
- 使用 [Leaflet.js](https://leafletjs.com/) 搭配 [Mapbox](https://www.mapbox.com/) 處理地圖資訊
- 使用 [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) 實作不同尺度下的 marker 聚散效果，並解決站點距離過近導致重合的問題
- 使用 [axios](https://github.com/axios/axios) 處理 AJAX 請求，取得 API 資料
- 使用 [vue-svg-loader](https://github.com/visualfanatic/vue-svg-loader)處理 svg 圖檔
- 使用 [lottie-web](https://github.com/airbnb/lottie-web)實現載入頁面動畫

## 特色介紹

### 查詢附近站點

1. 透過定位功能，顯示使用者附近自行車站點位置。
2. 點擊站點可顯示詳細資訊，包含站點名稱、可租車數、可還空位等。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-1.png)

3. 可搜尋特定站點名稱，並顯示該站點具體位置。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-2.png)
4. 使用者可拖曳地圖，並顯示拖曳後的地圖附近站點。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-3.gif)

### 查詢自行車道

1. 可查詢不同縣市的自行車道清單，並顯示相關資訊，包含車道名稱、長度等。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-4.png)
2. 點擊自行車道，可顯示特定車道具體位置。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-5.png)

### 附近美食景點

1. 透過定位功能，顯示使用者附近觀光景點與美食餐廳。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-6.png)
2. 點擊該景點/美食，可顯示詳細資訊與具體位置。
   ![image](https://github.com/DotSea/F2E-where-is-you-bike/blob/main/public/readme-image/readme-7.png)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

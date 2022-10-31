<template>
  <map-vue ref="binyaMapRef" :sizeConfig="sizeConfig" :mapConfig="mapConfig"></map-vue>

  <div class="actions">
    <div class="btn" @click="addArea">初始化标记区域</div>
    <div class="btn" @click="addMarker">加marker</div>
    <div class="btn" @click="clearMarkers">移除marker</div>
    <div class="btn" @click="addPolygon">一户一档</div>
    <div class="btn" @click="removePolygon">切换一户一档，清楚线条</div>
    

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { shanghai, suzhou, wuxi} from "./assets/info"
const binyaMapRef = ref(null)


const sizeConfig = reactive({
  with: '400px',
  height: '500px'
})

const mapConfig = reactive({
  key: 'd877397a11fadbb8c32fe56c7e02dc2d',
  plugins: ['PolygonEditor'], // 地图需要的插件
  center: [121.045332, 31.19884], // 中心坐标
  zoom:  8.8, //初始化的缩放比例
  zooms: [3, 20], // 缩放比例的边界
  imageLayer: {
    url: 'https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
    bounds: [[116.327911, 39.939229],[116.342659, 39.946275]],
    zooms: [15, 20]
  }, // 图片图层
})



onMounted(() => {
  addArea()
})

// 初始化标记区域
const addArea = () => {
  binyaMapRef.value.addArea({strokeOpacity: 1, fillColor: '#f00', strokeWeight: 5, strokeStyle: 'dashed',}, shanghai, {show: false})
  binyaMapRef.value.addArea({strokeOpacity: 1, fillColor: '#f00', strokeWeight: 5, strokeStyle: 'dashed',}, wuxi, '', {show: false})
  binyaMapRef.value.addArea({strokeOpacity: 1, fillColor: '#f00', strokeWeight: 5, strokeStyle: 'dashed',}, suzhou, '', {show: false})
}
// 点击一户一档的其中一户
const addPolygon = () => {
  // 多边形的样式配置
  const polygonConfig = { strokeOpacity: 1, strokeWeight: 4, strokeColor: '#ff0000'}
  const data = [
      [
          119.952784,
          30.385771
      ],
      [
          119.955145,
          30.384966
      ],
      [
          119.95425,
          30.384916
      ],
      [
          119.952974,
          30.384736
      ],
      [
          119.952689,
          30.385163
      ]
  ]
  const center = [119.953571, 30.385556]
  const infoWindowConfig = {
    show: true,
    infoHtml: "电话 : 010-84107000 <br>地址 : 北京市望京阜通东大街方恒国际中心A座16层"
  }
  binyaMapRef.value.addPolygon(polygonConfig, data, center, infoWindowConfig)
}
// 移除边界线
const removePolygon = () => {
  binyaMapRef.value.removePolygon()
}

const addMarker = () => {
  const data = [
    {lng: 121.7789, lat: 31.3102}
  ]
  binyaMapRef.value.addMarker({
    data: data, icon: '/src/assets/marker.png', callback: (e) => {
    console.log('我点击marker', e)
  }})
}

const clearMarkers = () => {
  binyaMapRef.value.clearMarkers()
}
</script>

<style scoped>
.actions {
  position: absolute;
  bottom: 100px;
  right: 20px;
  display: flex;
  flex-wrap: wrap;
}
.btn {
  border-radius: 4px;
  border: 1px solid #747bff;
  padding: 2px 6px;
  color: #747bff;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>

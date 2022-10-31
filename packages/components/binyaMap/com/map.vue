<template>
  <div id="container" :style="sizeConfig"></div>
</template>
<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef, onMounted, ref, reactive } from 'vue'

const props = defineProps({
  sizeConfig: {
    type: Object,
    default: {
      width: '100%',
      height: '100%'
    }
  },
  mapConfig: {
    type: Object,
    default: {
      key: '', // 高德key
      plugins: [], // 地图需要的插件
      center: [], // 中心坐标
      zoom: 2, //初始化的缩放比例
      zooms: [3, 20], // 缩放比例的边界
      imageLayer: {
        url: '',
        bounds: '',
        zooms: []
      }, // 图片图层

    }
  }
})


const map = shallowRef(null) // 非深度监听
const polygon = shallowRef(null) // 多边形绘制
const markers = ref([])

// 初始化地图
const initMap = async () => {
  const AMap = await AMapLoader.load({
    key: props.mapConfig.key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: props.mapConfig.plugins // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
  const { url, bounds, zooms } = props.mapConfig.imageLayer || {}
  // 图片图层
  const imageLayer = url && new AMap.ImageLayer({
    url,
    bounds: new AMap.Bounds(bounds[0], bounds[1]),
    zooms
  })

  const layers = []
  url && (layers.push(imageLayer))

  map.value = new AMap.Map("container", {  //设置地图容器id
    zoom: props.mapConfig.zoom, // 初始化地图级别
    center: props.mapConfig.center, // 初始化地图中心点位置
    layers: [
      AMap.createDefaultLayer(),
      ...layers
    ]
  })
}


/**
 * 阴影区域样式 data 该区域的坐标点
 * @param {*} data 坐标点, 二维数组
 * @param {*} config 配置项
 * @param {*} center 中心点坐标点
 * @param {*} infoWindowConfig 信息窗体
 *
 */
const addPolygon = async (config = {}, data, center, infoWindowConfig = { show: true }) => {
  const AMap = await AMapLoader.load({
    key: props.mapConfig.key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: props.mapConfig.plugins // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
  // 放大并且聚集到中心点
  map.value.setZoomAndCenter(15, center)
  let infoWindow = ''
  const { fillColor = '#ccebc5', strokeOpacity = 0, fillOpacity = 0, strokeColor = '#2b8cbe',
    strokeWeight = 1, strokeStyle = 'solid', strokeDasharray = [5, 5], bubble = true, cursor = 'pointer',
    mouseoverFillOpacity=0.7, mouseoverFillColor='#7bccc4', mouseoutFillOpacity=0, mouseoutFillColor='#ccebc5'
  } = config
  polygon.value = new AMap.Polygon({
    path: data,
    fillColor, // 多边形填充颜色，使用16进制颜色代码赋值，如：#00B2D5
    strokeOpacity, // 轮廓线透明度，取值范围 [0,1] ，0表示完全透明，1表示不透明。默认为0.9
    fillOpacity, // 多边形填充透明度，取值范围 [0,1] ，0表示完全透明，1表示不透明。默认为0.5
    strokeColor, // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
    strokeWeight, // 轮廓线宽度
    strokeStyle, // 轮廓线样式，实线:solid，虚线:dashed
    strokeDasharray,
    bubble, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
    cursor // 指定鼠标悬停时的鼠标样式，自定义cursor，IE仅支持cur/ani/ico格式，Opera不支持自定义cursor
  });
  polygon.value.on('mouseover', () => {
    polygon.value.setOptions({
      fillOpacity: mouseoverFillOpacity,
      fillColor: mouseoverFillColor
    })
    if (infoWindowConfig.show) {
      infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(100, 0), // 窗体偏移量
        anchor: 'top-left',
        content: infoWindowConfig.infoHtml
      });
      infoWindow.open(map.value, center);
    }
    
  })
  polygon.value.on('mouseout', () => {
    polygon.value.setOptions({
      fillOpacity: mouseoutFillOpacity,
      fillColor: mouseoutFillColor
    })
    if (infoWindowConfig.show) { 
      infoWindow.close(map.value, center);
    }
    
  })
  map.value.add(polygon.value);
}
/**
 * 移除多边形，每次点击一户一档前要清除掉上一个多面性
 *
 */
const removePolygon = () => {
  polygon.value && (map.value.remove(polygon.value))
}


/**
 * 画区域样式 data 该区域的坐标点
 * @param {*} data 坐标点, 二维数组
 * @param {*} config 配置项
 * @param {*} center 中心点坐标点
 *
 */
const addArea = async (config = {}, data) => {
  const AMap = await AMapLoader.load({
    key: props.mapConfig.key, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: props.mapConfig.plugins // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
  
  let infoWindow = ''
  const { fillColor = '#ccebc5', strokeOpacity = 1, fillOpacity = 0.5, strokeColor = '#2b8cbe',
    strokeWeight = 1, strokeStyle = 'solid', strokeDasharray = [5, 5], bubble = true, cursor = 'pointer',
    mouseoverFillOpacity=0.7, mouseoverFillColor='#7bccc4', mouseoutFillOpacity=0, mouseoutFillColor='#ccebc5'
  } = config
  let polygon = new AMap.Polygon({
    path: data,
    fillColor, // 多边形填充颜色，使用16进制颜色代码赋值，如：#00B2D5
    strokeOpacity, // 轮廓线透明度，取值范围 [0,1] ，0表示完全透明，1表示不透明。默认为0.9
    fillOpacity, // 多边形填充透明度，取值范围 [0,1] ，0表示完全透明，1表示不透明。默认为0.5
    strokeColor, // 线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC
    strokeWeight, // 轮廓线宽度
    strokeStyle, // 轮廓线样式，实线:solid，虚线:dashed
    strokeDasharray,
    bubble, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
    cursor // 指定鼠标悬停时的鼠标样式，自定义cursor，IE仅支持cur/ani/ico格式，Opera不支持自定义cursor
  });
  polygon.on('mouseover', () => {
    polygon.setOptions({
      fillOpacity: mouseoverFillOpacity,
      fillColor: mouseoverFillColor
    })
    
  })
  polygon.on('mouseout', () => {
    polygon.setOptions({
      fillOpacity: mouseoutFillOpacity,
      fillColor: mouseoutFillColor
    })
  })
  map.value.add(polygon);
}


/**
 * 添加点标记
 * @param {*} data 坐标点, 数组
 * @param {*} content 坐标点, 数组
 * @param {*} anchor 
 * @param {*} icon 点坐标图片
 * @param {*} label 别名设置， lng，lat， title
 * @param {*} anchor 位置， 默认bottom-center
 * @param {*} callback 点击时间的回调
 */

const addMarker = ({data, icon, label = { lng: 'lng', lat: 'lat', title: 'title' }, content, anchor='bottom-center', center, callback}) => {
  const arr = []
  data.forEach((item) => {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(item[label['lng']], item[label['lat']]),
      anchor,
      icon: icon,
      content
    })
    marker.on("click", (e) => {
      callback(e)
    })
    arr.push(marker)
  })
  map.value.add(arr)
  markers.value = arr
  console.log(markers)
}

// 清楚点坐标
const clearMarkers = () => {
  map.value.remove(markers.value);
}


// 多边形吸附


// 组件挂载
onMounted(() => {
  initMap()
})

defineExpose({
  map,
  addPolygon,
  removePolygon,
  addArea,
  addMarker,
  markers,
  clearMarkers
})
</script>






<script >
  export default {
    name: "mapVue",
  }
</script>
<style  scoped>
  #container{
    padding:0px;
    margin: 0px;
  }
</style>
<template>
  <div ref="cesiumContainer" class="cesium-container">
    <div class="panel">
      <span @click="resetPage" class="myButton fire">重置</span>
      <span @click="resetLatLongGrid" class="myButton ice">重置经纬网</span>
      <span @click="() => operateLayer('climateLayer')" class="myButton nature">{{visible.climateLayer ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer('demo')" class="myButton mystic">{{visible.demo ? '隐藏' : '显示'}}demo</span>
      <span @click="() => operateLayer()" class="myButton metal">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton ocean">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton sunset">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton jade">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton rose-gold">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton aurora">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton night-sky">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
      <span @click="() => operateLayer()" class="myButton sakura">{{climateButtonVisible ? '隐藏' : '显示'}}气候分布</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { simplify, rewind } from '@turf/turf'
import geojsonDemo from '../assets/geo/geojsonDemo.js';
import { coordEach } from '@turf/meta';

function sanitizeGeoJSON(geojson) {
  coordEach(geojson, (coord) => {
    // 1. 标准化经度到 [-180, 180]
    coord[0] = ((coord[0] + 180) % 360 + 360) % 360 - 180;
    
    // 2. 限制纬度到 [-90, 90]
    coord[1] = Math.max(-90, Math.min(90, coord[1]));
    
    // 3. 坐标精度裁剪（避免浮点数误差）
    coord[0] = Number(coord[0].toFixed(7));
    coord[1] = Number(coord[1].toFixed(7));
  });

  // 4. 强制闭合多边形（处理精度导致的未闭合）
  geojson.features.forEach(feature => {
    if (feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates.forEach(ring => {
        if (ring.length > 0) {
          const first = ring[0].map(c => Number(c.toFixed(7)));
          const last = ring[ring.length - 1].map(c => Number(c.toFixed(7)));
          if (first[0] !== last[0] || first[1] !== last[1]) {
            ring.push([...first]);
          }
        }
      });
    }
  });

  return geojson;
}


// 容器引用
const cesiumContainer = ref()
let viewer = null
let climateDataSourceGeo = null;
let climateDataSourceGeoDemo = null;

const climateButtonVisible = ref(false);
const visible = reactive({
  climateLayer: false,
  demo: false,
});

var token = '88f746013d48f98c5f8d57c5344bc812';
// 服务域名
var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
// 服务负载子域
var subdomains=['0','1','2','3','4','5','6','7'];

// 初始化场景
const initCesium = async () => {
  if (!cesiumContainer.value) return

  // 初始化Cesium Viewer
  initViewer();

  // 叠加影像服务
  addImagery();

  // 叠加国界服务
  addBoundary();

  // 叠加地形服务
  // addTerrain();

  // 添加初始位置
  flyToInitPosition();

  // 叠加三维地名服务
  addGeoWTFS();

  addLatLongGrid(viewer);

  // 添加地形
  // try {
  //   viewer.terrainProvider = await Cesium.createWorldTerrainAsync()
  // } catch (error) {
  //   console.error('地形加载失败:', error)
  // }
}

// 初始化Cesium Viewer
const initViewer = () =>{
  viewer = new Cesium.Map(cesiumContainer.value, {
    shouldAnimate: true, //是否允许动画
    selectionIndicator: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    showRenderLoopErrors: false,
    shadows: false,
  });

  // 抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled=false;
  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true;
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(-20);
  viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000;
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
  ];

  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.PINCH,
    {
        eventType: Cesium.CameraEventType.LEFT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
    },
    {
        eventType: Cesium.CameraEventType.RIGHT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ];
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

// 添加影像图层
const addImagery = () => {
  var imgMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme : new Cesium.WebMercatorTilingScheme(),
    maximumLevel : 18
  });
  viewer.imageryLayers.addImageryProvider(imgMap); 
}

// 添加国界图层
const addBoundary = () => {
  var iboMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme : new Cesium.WebMercatorTilingScheme(),
    maximumLevel : 10
  });
  viewer.imageryLayers.addImageryProvider(iboMap);
}

// 添加地形图层
const addTerrain = () => {
  // try {
  //   var terrainUrls = new Array();

  //   for (var i = 0; i < subdomains.length; i++){
  //     var url = tdtUrl.replace('{s}', subdomains[i]) + 'mapservice/swdx?T=elv_c&tk=' + token;
  //     terrainUrls.push(url);
  //   }

  //   var provider = new Cesium.GeoTerrainProvider({
  //     urls: terrainUrls
  //   });

  //   viewer.terrainProvider = provider;
  // } catch (error) {
  //   console.log({error});
  // }
}

// 添加初始位置
const flyToInitPosition = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978),
      pitch: Cesium.Math.toRadians(-89.74026687972041),
      roll: Cesium.Math.toRadians(0)
    },
    complete: function callback() {
      // 启动自动旋转
      // startAutoRotate();
    }
  });
}

// 添加自动旋转函数
const startAutoRotate = () => {
  viewer.clock.onTick.addEventListener((clock) => {
    viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.002); // 调整 0.002 这个值可以改变旋转速度
  });
}

// 添加三维地名服务
const addGeoWTFS = () => {
  // 叠加三维地名服务
  var wtfs = new Cesium.GeoWTFS({
    viewer,
    //三维地名服务，使用wtfs服务
    subdomains:subdomains,
    metadata:{
        boundBox: {
            minX: -180,
            minY: -90,
            maxX: 180,
            maxY: 90
        },
        minLevel: 1,
        maxLevel: 20
    },
    depthTestOptimization: true,
    dTOElevation: 15000,
    dTOPitch: Cesium.Math.toRadians(-70),
    aotuCollide: true, //是否开启避让
    collisionPadding: [5, 10, 8, 5], //开启避让时，标注碰撞增加内边距，上、右、下、左
    serverFirstStyle: true, //服务端样式优先
    labelGraphics: {
        font:"28px sans-serif",
        fontSize: 28,
        fillColor:Cesium.Color.WHITE,
        scale: 0.5,
        outlineColor:Cesium.Color.BLACK,
        outlineWidth: 2,
        style:Cesium.LabelStyle.FILL_AND_OUTLINE,
        showBackground:false,
        backgroundColor:Cesium.Color.RED,
        backgroundPadding:new Cesium.Cartesian2(10, 10),
        horizontalOrigin:Cesium.HorizontalOrigin.LEFT,
        verticalOrigin:Cesium.VerticalOrigin.TOP,
        eyeOffset:Cesium.Cartesian3.ZERO,
        pixelOffset: new Cesium.Cartesian2(5, 5),
        disableDepthTestDistance:undefined
    },
    billboardGraphics: {
        horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
        verticalOrigin:Cesium.VerticalOrigin.CENTER,
        eyeOffset:Cesium.Cartesian3.ZERO,
        pixelOffset:Cesium.Cartesian2.ZERO,
        alignedAxis:Cesium.Cartesian3.ZERO,
        color:Cesium.Color.WHITE,
        rotation:0,
        scale:1,
        width:18,
        height:18,
        disableDepthTestDistance:undefined
    }
  });

  //三维地名服务，使用wtfs服务
  wtfs.getTileUrl = function(){
      return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&VERSION=1.0.0&tk='+ token; 
  }

  // 三维图标服务
  wtfs.getIcoUrl = function(){
      return tdtUrl + 'mapservice/GetIcon?id={id}&tk='+ token;
  }

  wtfs.initTDT([{"x":6,"y":1,"level":2,"boundBox":{"minX":90,"minY":0,"maxX":135,"maxY":45}},{"x":7,"y":1,"level":2,"boundBox":{"minX":135,"minY":0,"maxX":180,"maxY":45}},{"x":6,"y":0,"level":2,"boundBox":{"minX":90,"minY":45,"maxX":135,"maxY":90}},{"x":7,"y":0,"level":2,"boundBox":{"minX":135,"minY":45,"maxX":180,"maxY":90}},{"x":5,"y":1,"level":2,"boundBox":{"minX":45,"minY":0,"maxX":90,"maxY":45}},{"x":4,"y":1,"level":2,"boundBox":{"minX":0,"minY":0,"maxX":45,"maxY":45}},{"x":5,"y":0,"level":2,"boundBox":{"minX":45,"minY":45,"maxX":90,"maxY":90}},{"x":4,"y":0,"level":2,"boundBox":{"minX":0,"minY":45,"maxX":45,"maxY":90}},{"x":6,"y":2,"level":2,"boundBox":{"minX":90,"minY":-45,"maxX":135,"maxY":0}},{"x":6,"y":3,"level":2,"boundBox":{"minX":90,"minY":-90,"maxX":135,"maxY":-45}},{"x":7,"y":2,"level":2,"boundBox":{"minX":135,"minY":-45,"maxX":180,"maxY":0}},{"x":5,"y":2,"level":2,"boundBox":{"minX":45,"minY":-45,"maxX":90,"maxY":0}},{"x":4,"y":2,"level":2,"boundBox":{"minX":0,"minY":-45,"maxX":45,"maxY":0}},{"x":3,"y":1,"level":2,"boundBox":{"minX":-45,"minY":0,"maxX":0,"maxY":45}},{"x":3,"y":0,"level":2,"boundBox":{"minX":-45,"minY":45,"maxX":0,"maxY":90}},{"x":2,"y":0,"level":2,"boundBox":{"minX":-90,"minY":45,"maxX":-45,"maxY":90}},{"x":0,"y":1,"level":2,"boundBox":{"minX":-180,"minY":0,"maxX":-135,"maxY":45}},{"x":1,"y":0,"level":2,"boundBox":{"minX":-135,"minY":45,"maxX":-90,"maxY":90}},{"x":0,"y":0,"level":2,"boundBox":{"minX":-180,"minY":45,"maxX":-135,"maxY":90}}]);
}

const addManualLatLongGrid = (viewer) => {
	const entities = viewer.entities;
  const _label = {
    font: '12px sans-serif',
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    verticalOrigin: Cesium.VerticalOrigin.TOP,
    pixelOffset: new Cesium.Cartesian2(0, 5)
  };
	// 每隔20°绘制一条经度线
  for (let long = -180; long <= 180; long += 15) {
      let text = "";
      if (long === 0) {
          text = "0";
      }
      text += long === 0 ? "" : "" + long + "°";
      if (long === -180) {
          text = "";
      }
      entities.add({
        id: `longitude-line-${long}`,
        position: Cesium.Cartesian3.fromDegrees(long, 0),
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
                long,
                -90,
                long,
                0,
                long,
                90,
            ]),
            width: 1.0,
            material: Cesium.Color.WHITE,
        },
        label: {
            text: text,
            ..._label,
        },
      });
  }
  let longS = [];
  for (let long = -180; long <= 180; long += 5) {
      longS.push(long);
  }
  //每隔10°绘制一条纬度线
  for (let lat = -75; lat <= 75; lat += 15) {
      let text = "";
      text += "" + lat + "°";
      if (lat === 0) {
          text = "";
      }
      entities.add({
        id: `latitude-line-${lat}`,
        position: Cesium.Cartesian3.fromDegrees(0, lat),
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(
                longS
                    .map((long) => {
                        return [long, lat].join(",");
                    })
                    .join(",")
                    .split(",")
                    .map((item) => Number(item))
            ),
            width: 1.0,
            material: Cesium.Color.WHITE,
        },
        label: {
            text: text,
            ..._label,
        },
      });
  }
}

// 点击经纬线使其高亮
const toggleLineHighlight = (entity) => {
  if (entity && entity.polyline) {

    const currentMaterial = entity.polyline.material;
    const isHighlighted = Cesium.Color.equals(currentMaterial.color._value, Cesium.Color.YELLOW);


    entity.polyline.material = new Cesium.ColorMaterialProperty(isHighlighted ? Cesium.Color.WHITE : Cesium.Color.YELLOW);
    entity.polyline.width = isHighlighted ? 1.0 : 3.0; // Change width when highlighted
  }
};

// 添加hover event listener
const setupHoverListener = () => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((movement) => {
    const pickedObject = viewer.scene.pick(movement.endPosition);
    if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.polyline) {
      viewer.scene.canvas.style.cursor = 'pointer'; // Change cursor to pointer
    } else {
      viewer.scene.canvas.style.cursor = 'default'; // Reset cursor
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
};

// 添加 click event listener
const setupClickListener = () => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id) {
      toggleLineHighlight(pickedObject.id);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

/**
 * 添加经纬网
 */
const addLatLongGrid = (viewer) => {
  // 添加经纬网格
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.showGroundAtmosphere = true;
  addManualLatLongGrid(viewer);

  // 添加监听
  setupClickListener();
  // setupHoverListener();
}

// 获取视口中心的经线
const getCenterLongitude = () => {
  const center = viewer.camera.positionCartographic;
  const centerLongitude = Cesium.Math.toDegrees(center.longitude);
  return centerLongitude;
};

// 在视口中心的经线上显示纬度度数
const showLatitudeLabelsOnCenterLongitude = (range = 5, interval = 15) => {
  const centerLongitude = getCenterLongitude();
  
  // 移除之前的纬度标注
  removeLatitudeLabels();

  // 计算并添加标注
  for (let i = -range; i <= range; i++) {
    const latitude = i * interval;
    viewer.entities.add({
      id: `latitude-label-${latitude}`, // 为每个标注设置唯一的 id
      position: Cesium.Cartesian3.fromDegrees(centerLongitude, latitude),
      label: {
        text: latitude + '°',
        font: '12px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 5)
      }
    });
  }
};

// 移除之前的纬度标注
const removeLatitudeLabels = () => {
  const entities = viewer.entities.values;
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].id && entities[i].id.startsWith('latitude-label-')) {
      viewer.entities.remove(entities[i]);
    }
  }
};

// 监听相机变化事件
const setupCameraChangeListener = () => {
  let lastCenterLongitude = getCenterLongitude();

  viewer.camera.changed.addEventListener(() => {
    const currentCenterLongitude = getCenterLongitude();
    // 如果中心经线发生变化，更新标注
    if (Math.abs(currentCenterLongitude - lastCenterLongitude) >= 7.5) {
      showLatitudeLabelsOnCenterLongitude();
      lastCenterLongitude = currentCenterLongitude;
    }
  });
};

const operateLayer = (name=undefined) => {
  if (!name) return;
  if (visible[name]) {
    // 清除之前的图层
    const existingSource = viewer.dataSources.getByName(name)[0];
    if (existingSource) {
      viewer.dataSources.remove(existingSource);
    }
  } else {
    // 加载新的图层
    const layerMap = {
      climateLayer: climateDataSourceGeo,
      demo: climateDataSourceGeoDemo,
    }
    viewer.dataSources.add(layerMap[name]);
    // 自动定位到数据范围
    // viewer.zoomTo(climateDataSourceGeo);
  }
  visible[name] = !visible[name];
}

// 重置页面
const resetPage = async () => {
  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy();
  }
  viewer = null;
  visible.climateLayer = false;
  await initCesium();
}

// 重置经纬网
const resetLatLongGrid = async () => {
  const entities = viewer.entities.values;
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].id && (entities[i].id.startsWith('longitude-line-') || entities[i].id.startsWith('latitude-line-'))) {
      const _material = entities[i].polyline.material;
      const isHighlighted = Cesium.Color.equals(_material.color._value, Cesium.Color.YELLOW);
      if (isHighlighted) {
        entities[i].polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.WHITE);
        entities[i].polyline.width = 1.0;
      }
    }
  }
}

// 生命周期
onMounted(async () => {
  await initCesium();
  climateDataSourceGeoDemo = await Cesium.GeoJsonDataSource.load('/geo/geojsonDemo.geojson', {
    stroke: Cesium.Color.RED,
    strokeWidth: 2,
    fill: Cesium.Color.PINK
  });
  climateDataSourceGeoDemo.name = 'demo';
  // 预加载气候图层
  // climateDataSourceGeo = await Cesium.KmlDataSource.load('/geo/temp_zone.kml', {
  //   stroke: Cesium.Color.RED,
  //   strokeWidth: 2
  // });
  // const response = await fetch('/geo/Gadm41-Aus-2.geojson')
  // if (!response.ok) throw new Error('网络响应异常')
  // const originalGeoJSON = await response.json()

  // // 2. 使用 Turf 简化数据
  // const simplifiedGeoJSON = simplify(originalGeoJSON, {
  //   tolerance: 0.01,
  //   highQuality: true
  // })
  // // const fixedGeoJSON = rewind(originalGeoJSON, {
  // //   reverse: false,  // 外环逆时针 (false) 或顺时针 (true)
  // //   mutate: false    // 是否直接修改原数据
  // // });
  // // 使用
  // // const simplified = turf.simplify(originalGeoJSON, { tolerance: 0.01 });
  // // const cleaned = sanitizeGeoJSON(simplifiedGeoJSON);
  // console.log('simplifiedGeoJSON', JSON.stringify(simplifiedGeoJSON));
  climateDataSourceGeo = await Cesium.GeoJsonDataSource.load('/geo/Gadm41-Aus-1.geojson', {
    stroke: Cesium.Color.RED,
    strokeWidth: 2,
  });
  climateDataSourceGeo.name = 'climateLayer';
  // 显示视口中心的经线上纬度标注
  showLatitudeLabelsOnCenterLongitude();
  // 设置相机变化监听器
  setupCameraChangeListener();
  console.log('Cesium Viewer 初始化完成')
})

onUnmounted(() => {
  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100vh;
  background: #000;
}
.panel {
  position: absolute;
  top: 40px;
  left: 10px;
  z-index: 999;
}
</style>
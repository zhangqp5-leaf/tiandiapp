import * as THREE from "three";
import universeImg from "../assets/img/universe.jpg";
import starImg from "../assets/img/star.jpg"; //星辰
import venusAtmosphereImg from "../assets/img/venusAtmosphere.jpg"; //金星大气
import moonImg from "../assets/img/moon.jpg"; //月球
import earthNormalImg from "../assets/img/earthNormal.jpg"; //法线贴图
import earthCloudsImg from "../assets/img/earthClouds.jpg"; //地球云层

// 初始化宇宙
export const initUniverse = (scene) => {
  let universeGeometry = new THREE.SphereGeometry(7000, 100, 100);
  let texture = new THREE.TextureLoader().load(universeImg);
  let universeMaterial = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial);
  scene.add(universeMesh);

  // 创建中心太阳点光源，增加光照强度
  let pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);
};

// 背景星辰mesh
export const initBackgroundStars = (scene) => {
  const positions = [];
  //星辰几何体
  const starsGeometry = new THREE.BufferGeometry();
  //添加星辰的颜色与位置
  for (let i = 0; i < 8000; i++) {
    let vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    positions.push(vertex.x, vertex.y, vertex.z);
  }
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  //星辰材质
  let starsMaterial = new THREE.PointsMaterial({
    map: new THREE.TextureLoader().load(starImg),
    size: 6,
    blending: THREE.AdditiveBlending,
    fog: true,
    depthTest: false,
  });
  //星辰的集合
  let starsMesh = new THREE.Points(starsGeometry, starsMaterial);
  starsMesh.scale.set(7000, 7000, 7000); //设置集合体范围
  scene.add(starsMesh);
};

// 公转轨迹
export const initRevolutionTrajectory = (data, scene) => {
  if (data.name == "太阳") {
    return;
  }
  let trackGeometry = new THREE.RingGeometry(
    data.position[0],
    data.position[0] + 2,
    1000
  );
  let trackMaterial = new THREE.LineBasicMaterial({
    color: '#f8f8f8',
    side: THREE.DoubleSide,
  });
  let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
  trackMesh.position.set(0, 0, 0); //轨道位置
  trackMesh.rotation.set(0.5 * Math.PI, 0, 0); //旋转轨道至水平
  scene.add(trackMesh);
};

// 获取普通星球本体mesh
export const getPlanetMesh = (data) => {
  const planetGeometry = new THREE.SphereGeometry(data.size, 100, 100);
  const planetMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load(data.mapImg),
  });
  return new THREE.Mesh(planetGeometry, planetMaterial);
};

// 日冕mesh
const getSunAtmosphereMesh = (data) => {
  const sunAtmosphereGeometry = new THREE.SphereGeometry(data.size + 8, 100, 100);
  const sunAtmosphereMaterial = new THREE.MeshLambertMaterial({
    color: '#FFC607',
    transparent: true,
    opacity: 0.2,
  });
  return new THREE.Mesh(sunAtmosphereGeometry, sunAtmosphereMaterial);
};

// 太阳
export const initSun = (data, scene) => {
  let sunGroup = new THREE.Group(); //太阳的组
  
  // 修改太阳的材质为自发光材质
  const sunGeometry = new THREE.SphereGeometry(data.size, 100, 100);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(data.mapImg),
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunGroup.add(sunMesh);
  
  // sunGroup.add(getSunAtmosphereMesh(data));
  sunGroup.name = data.name; //网格名字
  sunGroup.planetMsg = data;
  sunGroup.isPlanet = true; //标识为星球
  sunGroup.angle = 0; //添加初始角度
  //球体位置
  sunGroup.position.set(
    data.position[0],
    data.position[1],
    data.position[2]
  );
  scene.add(sunGroup);
};

// 地球mesh
const getEarth = (data) => {
  const earthGeometry = new THREE.SphereGeometry(data.size, 100, 100);
  const earthMaterial = new THREE.MeshPhysicalMaterial({
    map: new THREE.TextureLoader().load(data.mapImg),
    normalScale: new THREE.Vector2(10, 10),
    normalMap: new THREE.TextureLoader().load(earthNormalImg),
  });
  return new THREE.Mesh(earthGeometry, earthMaterial);
};
// 地球云层mesh
const getEarthClouds = (data) => {
  const earthCloudsGeometry = new THREE.SphereGeometry(data.size + 2, 100, 100);
  const earthCloudsMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    map: new THREE.TextureLoader().load(earthCloudsImg),
  });
  return new THREE.Mesh(earthCloudsGeometry, earthCloudsMaterial);
};
// 月球轨道mesh
const getMoonTrack = (data) => {
  const moonTrackGeometry = new THREE.RingGeometry(data.size + 40, data.size + 40.2, 100);
  const moonTrackMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const moonTrackMesh = new THREE.Mesh(moonTrackGeometry, moonTrackMaterial);
  moonTrackMesh.rotation.set(0.5 * Math.PI, 0, 0);
  return moonTrackMesh;
};
// 月球mesh
const getMoon = (data) => {
  const moonGeometry = new THREE.SphereGeometry(10, 100, 100);
  const moonMaterial = new THREE.MeshPhysicalMaterial({
    map: new THREE.TextureLoader().load(moonImg),
    normalScale: new THREE.Vector2(10, 10), //凹凸深度
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.position.set(data.size + 40, 0, 0);
  return moonMesh;
};

// 地球
export const initEarth = (data, scene) => {
  const earthGroup = new THREE.Group();
  earthGroup.add(getEarth(data));
  earthGroup.add(getEarthClouds(data));
  earthGroup.add(getMoonTrack(data));
  earthGroup.add(getMoon(data));

  earthGroup.name = data.name; //网格名字
  earthGroup.planetMsg = data;
  earthGroup.isPlanet = true; //标识为星球
  earthGroup.angle = 0; //添加初始角度
  //球体位置
  earthGroup.position.set(
    data.position[0],
    data.position[1],
    data.position[2]
  );
  scene.add(earthGroup);
};

// 金星大气mesh
const getVenusAtmosphere = (data) => {
  const venusAtmosphereGeometry = new THREE.SphereGeometry(data.size + 2, 100, 100);
  const venusAtmosphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    map: new THREE.TextureLoader().load(venusAtmosphereImg),
  });
  return new THREE.Mesh(venusAtmosphereGeometry, venusAtmosphereMaterial);
};

// 金星
export const initVenus = (data, scene) => {
  const venusGroup = new THREE.Group();
  venusGroup.add(getPlanetMesh(data));
  
  venusGroup.add(getVenusAtmosphere(data)); //将大气添加到组中
  venusGroup.name = data.name; //网格名字
  venusGroup.planetMsg = data;
  venusGroup.isPlanet = true; //标识为星球
  venusGroup.angle = 0; //添加初始角度
  //球体位置
  venusGroup.position.set(
    data.position[0],
    data.position[1],
    data.position[2]
  );
  scene.add(venusGroup);
};

// 土星星环mesh
const getSaturnTrack = (data, ringParams, opacity) => {
  const [param1, param2] = ringParams;
  const saturnTrackGeometry = new THREE.RingGeometry(data.size + param1, data.size + param2, 100);
  const saturnTrackMaterial = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: opacity,
    color: 0xc0ad87,
    side: THREE.DoubleSide,
  });
  const saturnTrackMesh = new THREE.Mesh(saturnTrackGeometry, saturnTrackMaterial);
  saturnTrackMesh.rotation.set(0.5 * Math.PI, 0, 0);
  return saturnTrackMesh;
};

// 土星
export const initSaturn = (data, scene) => {
  const saturnGroup = new THREE.Group();
  saturnGroup.add(getPlanetMesh(data));
  saturnGroup.add(getSaturnTrack(data, [10, 25], 0.8)); //将网格添加到组中
  saturnGroup.add(getSaturnTrack(data, [26, 30], 0.5));
  saturnGroup.add(getSaturnTrack(data, [30.1, 32], 0.3));
  saturnGroup.name = data.name; //网格名字
  saturnGroup.planetMsg = data;
  saturnGroup.isPlanet = true; //标识为星球
  saturnGroup.angle = 0; //添加初始角度
  //球体位置
  saturnGroup.position.set(
    data.position[0],
    data.position[1],
    data.position[2]
  );
  scene.add(saturnGroup);
};
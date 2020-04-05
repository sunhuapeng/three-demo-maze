/*
  ? 初始化场景所需的素材
*/
const THREE = require("three");
import { CSS2DRenderer } from "../../node_modules/three/examples/jsm/renderers/CSS2DRenderer";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";
// 屏幕宽度
const width = window.innerWidth;
// 屏幕高度
const height = window.innerHeight;
// 3d容器
const container = document.body;
// 视锥尺寸
const frustumSize = 1000
// 镜头默认角度
const CameraDefaultPosition = new THREE.Vector3(200, 500, 0);
// 创建场景
export function initScene() {
  let scene: any
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x374b79); //场景背景色
  // scene.position.setZ(-200)
  // scene.position.setX(-200)
  // scene.rotation.y = Math.PI * 1.5
  return scene
}
// 创建摄像机
export function initCamera() {
  let camera: any
  // camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
  camera = new THREE.OrthographicCamera(width / - 4, width / 4, height / 4, height / - 4, 1, 5000);
  camera.position.copy(CameraDefaultPosition);
  return camera
}

export function initRenderer() {
  let renderer: any
  renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
    precision: "lowp", //渲染器精度  "highp", "mediump"  "lowp"
    alpha: true,
    powerPreference: "low-power"
  });
  // 设置屏幕像素比，防止在不同显示屏上模糊
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height); //设置渲染的尺寸
  renderer.sortObjects = false; //定义渲染器是否应对对象进行排序。默认是true.
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement);
  return renderer
}

export function initRenderer2D() {
  let labelRenderer: any
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);
  return labelRenderer
}


// 初始化轨道加载器(鼠标)
export function initControls(camera: any, renderer: any) {
  let controls: any
  controls = new OrbitControls(
    camera,
    renderer.domElement
  );
  // controls.enableRotate = false
  controls.enableKeys = false
  controls.target = new THREE.Vector3(200, 0, 200)
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.5;
  // controls.screenSpacePanning = true;
  // 缩放
  // 楼层  2.1
  // 店铺  4
  // controls.maxZoom = 4;
  // controls.minZoom = 1;
  // 垂直
  // controls.maxPolarAngle = Math.PI / 2.2;
  // controls.minPolarAngle = Math.PI / 4.1;
  //  水平
  // controls.minAzimuthAngle = -Math.PI + Math.PI * 0.1;
  // controls.maxAzimuthAngle = -Math.PI / 3.9;

  // controls.enableZoom = true;
  // 拖拽
  return controls
}
// 初始化平行光
export function initAmbientLight() {
  const AmbientLight = new THREE.AmbientLight(0xffffff, 1);
  return AmbientLight
}
export function initDirectional() {
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 2000, 0)
  return directionalLight
}
export function spotLight() {
  var spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 1000, 600);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 2000;
  spotLight.intensity = 1.2
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  return spotLight
}

export function spotLightHelper(spotLight: any) {
  return new THREE.SpotLightHelper(spotLight)
}
export function helper() {
  return new THREE.AxesHelper(300);
}
export function back() {
  var material = new THREE.MeshPhongMaterial({ color: 0x374b79, dithering: true });
  var geometry = new THREE.PlaneBufferGeometry(2000, 2000);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.x = - Math.PI * 0.5;
  mesh.receiveShadow = true;
  return mesh
}
export function box() {
  var material = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true });

  var geometry = new THREE.BoxBufferGeometry(30, 10, 20);

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 10, 0);
  mesh.castShadow = true;
  return mesh
}

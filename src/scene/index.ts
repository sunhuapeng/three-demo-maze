import { initScene, initCamera, initRenderer, initRenderer2D, initControls, initAmbientLight, initDirectional, helper, spotLight, spotLightHelper, box, back } from '../createThreeScene/index'
import CreateLead from '../createLead/index'
import MadeMap from '../maze-map/index'
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");
import '../style/index.less'
import '../style/clear-style.less'
import DrawMap from '../draw-map/index';
export default class Made {
  private scene: any //场景
  private camera: any; //相机
  private renderer: any; //渲染器
  private controls: any; //控制器
  private labelRenderer: any; //2d渲染器
  private Lead: any //被控制的主角
  private getMap: any //地图
  private Map: any //地图
  constructor() {
    this.created()
  }
  created() {
    // 创建场景
    this.scene = initScene()
    this.camera = initCamera()
    this.renderer = initRenderer()
    this.labelRenderer = initRenderer2D()
    this.controls = initControls(this.camera, this.renderer);
    this.scene.add(initAmbientLight())
    const spotL = spotLight()
    this.scene.add(spotL)
    this.scene.add(spotLightHelper(spotL))
    this.scene.add(helper())
    // this.scene.add(back())

    // 加载glft地图
    let url = './static/gltf/map.gltf'
    this.getMap = new DrawMap(url)

    window.addEventListener("resize", () => { this.onWindowResized(); }, false);
  }

  onWindowResized() {
    var aspect = window.innerWidth / window.innerHeight;
    this.camera.left = - 500 * aspect / 2;
    this.camera.right = 500 * aspect / 2;
    this.camera.top = 500 / 2;
    this.camera.bottom = - 500 / 2;
    this.camera.updateProjectionMatrix();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  animate() {
    requestAnimationFrame(() => {
      this.render();
    });
    TWEEN.update();
    this.controls.update();
  }
  render() {
    this.animate()
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }
}

const win: any = window
const maze: any = new Made()
win.maze = maze
maze.render()
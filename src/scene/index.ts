import { initScene, initCamera, initRenderer, initRenderer2D, initControls, initAmbientLight, initDirectional, helper, spotLight, spotLightHelper, box, back } from '../createThreeScene/index'
import CreateLead from '../createLead/index'
import MadeMap from '../maze-map/index'
const THREE = require("three");
const TWEEN = require("@tweenjs/tween.js");
import '../style/index.less'
import '../style/clear-style.less'
export default class Made {
  private scene: any //场景
  private camera: any; //相机
  private renderer: any; //渲染器
  private controls: any; //控制器
  private labelRenderer: any; //2d渲染器
  private Lead: any //被控制的主角
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
    // this.scene.add(initDirectional())
    this.scene.add(initAmbientLight())
    const spotL = spotLight()
    this.scene.add(spotL)
    this.scene.add(spotLightHelper(spotL))
    this.scene.add(helper())
    // this.scene.add(box())
    this.scene.add(back())
    new MadeMap()
    // 创建主角
    this.Lead = new CreateLead(this.scene, this.camera, this.controls)
    this.Lead.create()
    this.Lead.createEndPoint()
    document.addEventListener('keydown', () => {
      this.onKeyDown(event)
    }, false);
    window.addEventListener("resize", () => { this.onWindowResized(); }, false);
  }

  onKeyDown(event: any) {
    const c = event.keyCode
    switch (c) {
      case 37:
        this.Lead.keyDown(c)
        break
      case 38:
        this.Lead.keyDown(c)
        break
      case 39:
        this.Lead.keyDown(c)
        break
      case 40:
        this.Lead.keyDown(c)
        break
    }
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

let gameStar = document.getElementById('game-star')
let operative: any = document.querySelector('.operative')
if (gameStar) {
  gameStar.onclick = function () {
    if (operative) {
      operative.style.display = 'none'
    }
    const win: any = window
    const maze: any = new Made()
    win.maze = maze
    maze.render()
    let btn = document.getElementById('btn')
    if (btn) {
      btn.onclick = () => {
        var points = [];
        const lead = maze.Lead.lead
        const actionRoute = lead.userData.actionRoute
        if (actionRoute && actionRoute.length !== 0) {
          // 开始运动
          for (let i = 0; i < actionRoute.length; i++) {
            const ar = actionRoute[i]
            // TODO: 20应该为单元格的尺寸 需要动态识别  10是单元格的一半
            // console.log(ar.x)
            const v3 = new THREE.Vector3(
              ar.y * 10 + 5 - 200,
              20,
              ar.x * 10 + 5 - 200
            )
            points.push(v3);
          }
          var material = new THREE.LineBasicMaterial({
            color: 0xfad97e
          });
          var geometry = new THREE.BufferGeometry().setFromPoints(points);
          var line = new THREE.Line(geometry, material);
          maze.scene.add(line);
        } else {
          alert('充值失败')
        }
      }
    }
  }
}
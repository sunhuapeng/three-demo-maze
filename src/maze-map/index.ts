const THREE = require("three");
import { LoadSvg } from '../loader/index'
import GetBox from '../tools/getBox';
import AstarCreate from '../astar/index'
import Load from '../loading/index';
export default class MadeMap {
  paths: any
  graph = []
  length: number
  star: any
  end: any
  pointArr: any
  lead: any
  load: any
  shapeMaterial: any
  shapeGroup: any
  win: any
  constructor() {
    this.load = new Load()
    this.load.start()
    // 迷宫材质
    this.shapeMaterial = new THREE.MeshLambertMaterial({
      color: 0xC9C9CD,
      side: THREE.DoubleSide,
      transparent: true,
    });
    new LoadSvg('./static/svg/01 pass.svg')
      .create()
      .then((data: any) => {
        this.paths = data.paths
        this.length = data.paths.length
        this.createMap()
      })
  }
  createMap() {
    this.win = window
    this.shapeGroup = new THREE.Group()
    this.win.maze.scene.add(this.shapeGroup)
    var nodeRow = []
    // 设置路径
    this.paths.forEach((path: any, index: number) => {
      if (index !== 0) {
        if (index % Math.sqrt(this.length) === 0) {
          nodeRow = []
          this.graph.push(nodeRow)
        }
      } else {
        this.graph.push(nodeRow)
      }
      if (path.subPaths[0].autoClose) {
        nodeRow.push(1)
      } else {
        nodeRow.push(0)
      }
      var shapes = path.toShapes(true);

      const name = path.userData.node.getAttribute('id')

      // 收集墙壁坐标点
      // if (path.subPaths[0].autoClose) {
      //   mesh.visible = false
      // }
      // 开始绘制形状
      const show = !!path.subPaths[0].autoClose
      this.drawShape(shapes, name, show)

      if (index === this.length - 1) {
        setTimeout(() => {
          this.load.end()
        }, 500)
      }
    });

    this.pointArr = new AstarCreate(this.star, this.end, this.graph)
    this.lead.userData.actionRoute = this.pointArr
  }
  createExtrudeGeometry(shape: any) {
    return new THREE.ExtrudeGeometry(shape, {
      bevelEnabled: false,
      bevelThickness: 1.5,
      bevelSize: 1,
      bevelSegments: 5,
      depth: 10
    });
  }
  // 开始绘制形状
  drawShape(shapes: any, name: string, show: boolean) {
    shapes.forEach((shape: any) => {
      let extrudeGeo = this.createExtrudeGeometry(shape);
      var mesh = new THREE.Mesh(extrudeGeo, this.shapeMaterial);
      mesh.rotateX(Math.PI * 0.5);
      mesh.castShadow = true;
      if (name) {
        mesh.name = name
      }
      mesh.visible = !show
      this.shapeGroup.add(mesh)
    })

    const size = new GetBox(this.shapeGroup).getSize()
    const p = new THREE.Vector3(-size.x / 2, size.y, -size.z / 2)
    this.shapeGroup.position.copy(p)

    this.shapeGroup.name = 'mate'
    this.shapeGroup.traverse((mesh: any) => {
      let wV3 = new THREE.Vector3
      wV3 = new GetBox(mesh).getCenter()
      if (mesh.name.indexOf('star') !== -1) {
        this.lead = this.win.maze.scene.getObjectByName('lead')
        if (this.lead) {
          mesh.visible = false
          this.lead.position.copy(wV3)
          this.star = this.lead
        }
      } else if (mesh.name.indexOf('end') !== -1) {
        const endPoint = this.win.maze.scene.getObjectByName('endPoint')
        if (endPoint) {
          mesh.visible = false
          endPoint.position.copy(wV3)
          this.end = endPoint
        }
      }
    })

  }
}
const THREE = require("three");
import { LoadSvg } from '../loader/index'
import GetBox from '../tools/getBox';
import AstarCreate from '../astar/index'
export default class MadeMap {
  paths: any
  graph = []
  length: number
  star: any
  end: any
  pointArr:any
  lead:any
  constructor() {
    // new LoadSvg('./static/svg/maze.svg')
    new LoadSvg('./static/svg/01 pass.svg')
      .create()
      .then((data: any) => {
        this.paths = data.paths
        this.length = data.paths.length
        console.log(this.paths)
        this.createMap()
      })
  }
  createMap() {
    var material = new THREE.MeshLambertMaterial({
      color: 0xC9C9CD,
      side: THREE.DoubleSide,
      // vertexColors: THREE.VertexColors,
      // wireframe: true,
      // depthWrite: true,
      transparent: true, // 是否透明
      // opacity: 0.2 //透明度
    });
    const win: any = window
    const group = new THREE.Group()
    var nodeRow = []
    // console.log(Math.sqrt(this.length))
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
      shapes.forEach((shape: any) => {
        let extrudeGeo = this.createExtrudeGeometry(shape);
        var mesh = new THREE.Mesh(extrudeGeo, material);
        mesh.rotateX(Math.PI * 0.5);
        mesh.castShadow = true;
        if (path.userData.node.getAttribute('id')) {
          mesh.name = path.userData.node.getAttribute('id')
        }
        if (path.subPaths[0].autoClose) {
          mesh.visible = false
        }
        group.add(mesh)
      })
      const size = new GetBox(group).getSize()
      // const p = new THREE.Vector3(0, size.y, 0)
      console.log(size)
      const p = new THREE.Vector3(-size.x / 2, size.y, -size.z / 2)
      group.position.copy(p)

      group.name = 'mate'
      // group.visible = false
      group.traverse((mesh: any) => {
        let wV3 = new THREE.Vector3
        wV3 = new GetBox(mesh).getCenter()
        if (mesh.name.indexOf('star') !== -1) {
          this.lead = win.maze.scene.getObjectByName('lead')
          if (this.lead) {
            mesh.visible = false
            this.lead.position.copy(wV3)
            // console.log('开始地址', wV3)
            this.star = this.lead
          }
        } else if (mesh.name.indexOf('end') !== -1) {
          const endPoint = win.maze.scene.getObjectByName('endPoint')
          if (endPoint) {
            mesh.visible = false
            endPoint.position.copy(wV3)
            this.end = endPoint
          }
        } 
      })

    });
    win.maze.scene.add(group)
    this.pointArr = new AstarCreate(this.star, this.end, this.graph)
    this.lead.userData.actionRoute = this.pointArr
  }
  createExtrudeGeometry(shape: any) {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 5,
      bevelEnabled: false,
      bevelThickness: 1.5,
      bevelSize: 1,
      bevelSegments: 5,
      amount: 10
    });
  }
}
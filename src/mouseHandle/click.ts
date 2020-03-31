import AstarCreate from "../astar/index";

const THREE = require("three");
let mouse = new THREE.Vector2(); //鼠标位置
let count = 0
let star = new THREE.Vector3()
let end = new THREE.Vector3()
export default class HandlePoint {
  event: any
  camera: any
  point: any
  scene: any
  graph: any[][]
  line:any
  constructor(event: any, point: any) {
    this.event = event
    this.camera = (window as any).maze.camera
    this.scene = (window as any).maze.scene
    this.point = point
    this.ray()
  }
  ray() {
    mouse.x = (this.event.clientX / document.body.offsetWidth) * 2 - 1;
    mouse.y = -(this.event.clientY / document.body.offsetHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    var intersects = raycaster.intersectObject(this.point);
    if (intersects[0]) {
      const p = intersects[0].point
      const np = this.getPoint(p)
      this.setBox(np)
      count++
      if (count === 1) {
        star.copy(np)
        if(this.line){
          this.scene.remove(this.line);
          this.line = null
        }
      }
      if (count === 2) {
        end.copy(np)
        count = 0
        this.graph = (window as any).graph
        const pointArr = new AstarCreate(star, end, this.graph)
        this.setLine(pointArr)
      }
    }
  }
  setBox(p: any) {
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(p)
    this.scene.add(cube);
  }
  getPoint(p: any) {
    const position = this.point.geometry.attributes.position
    const arr = position.array
    const pointC = position.count
    const limit = position.itemSize
    var L = 0
    var lenP: any = new THREE.Vector3()
    for (let i = 0; i < pointC; i++) {
      const np = new THREE.Vector3()
      np.fromArray(arr, i * limit)
      const len = np.clone().sub(p).length()
      if (i === 0) {
        L = len
        lenP.copy(np)
      } else {
        if (L > len) {
          L = len
          lenP.copy(np)
        }
      }
    }
    return lenP
  }
  setLine(pointArr:any) {
    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var points = [star];
    pointArr.forEach((point:any)=>{
      const v3 = new THREE.Vector3(
        point.x*10,
        10,
        point.y*10
      )
      points.push(v3)
    })

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    this.line = new THREE.Line(geometry, material);
    this.scene.add(this.line);
  }
}
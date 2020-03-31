import GetBox from "../tools/getBox"
const THREE = require("three");
export default class ComRayPoint {
  map: any
  scene: any
  cube: any
  pointGround: any
  pointArray: any[] = []
  vertices: any = []
  rayArr:any[] = []
  vectorArray = []
  constructor(map: any) {
    this.map = map
    const mate = this.map
    
    mate.children.forEach((child:any) => {
      if (child.name !== 'ground' && child.name.indexOf('escalator')!==0 && child.name.indexOf('elevator')!==0) {
        this.rayArr.push(child)
      }
    })

    this.scene = (window as any).maze.scene
    this.pointGround = new THREE.Group()
    this.scene.add(this.pointGround)
    this.setRayPoint()
  }
  setRayPoint() {
    const size = new GetBox(this.map).getSize()
    const x = Math.floor(size.x)
    const z = Math.floor(size.z)
    const y = size.y
    const first = []
    for (let i = 0; i < Math.floor(x / 10); i++) {
      const second = []
      first.push(second)
      for (let j = 0; j < Math.floor(z / 10); j++) {
        // this.pointArray.push(i * 10 - x / 2, y / 10, j * 10 - z / 2)
        // const p = new THREE.Vector3(i * 10 - x / 2, y / 10, j * 10 - z / 2)
        // this.pointArray.push(i * 10, y / 10, j * 10)
        
        const p = new THREE.Vector3(i * 10, y / 10, j * 10)
        const pA = []
        p.toArray(pA)
        this.pointArray.push(...p)
        const bool = this.rayCaster(p)
        this.vectorArray.push(p)
        // console.log(bool)
        if(bool){
          second.push(0)
        } else {
          second.push(1)
        }
      }
    }
    (window as any).graph = first
    ;(window as any).vectorArray = this.vectorArray
    // this.initPoint()
  }
  initPoint() {
    var geometry = new THREE.BufferGeometry();
    const geo = new THREE.Float32BufferAttribute(this.pointArray, 3)
    geometry.addAttribute('position', geo);
    for (let i = 0; i < geo.count; i++) {
      const v3 = new THREE.Vector3()
      v3.fromArray(geo.array, i * 3)
    }
    var material = new THREE.PointsMaterial({
      size: 10,
      // vertexColors: THREE.VertexColors, 
      depthTest: true,
      color: 0xffffff
    });
    var mesh = new THREE.Points(geometry, material);
    mesh.name = 'POINT_SHAPE'
    this.pointGround.add(mesh);
  }
  rayCaster(star:any):boolean {
    // 获取主角顶点信息
      // 顶点向量乘以四阶矩阵m   顶点信息的世界矩阵
      var vertexWorldCoord = star.clone().applyMatrix4(this.pointGround.matrixWorld); // 主角的世界变换（变换矩阵）
      // 设置一个向量
      var dir = new THREE.Vector3();
      // 将该向量设置为世界坐标与主角位置相减
      dir.subVectors(vertexWorldCoord, star);
      const end = new THREE.Vector3().setY(vertexWorldCoord.y)
      var raycaster = new THREE.Raycaster(star, end.clone().negate());
      if (!this.rayArr || this.rayArr.length===0) {
        return
      }
      var intersects = raycaster.intersectObjects(this.rayArr);
      if (intersects.length !== 0) {
        // this.setBox(star)
        return true
      } else {
        return false
      }
    // }
  }
  setBox(p: any) {
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(p)
    this.scene.add(cube);
  }
  setLine(star, end) {
    var material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });

    var points = [];
    points.push(star);
    points.push(end);

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}

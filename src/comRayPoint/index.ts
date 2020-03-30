import GetBox from "../tools/getBox"
const THREE = require("three");
export default class ComRayPoint {
  map: any
  scene: any
  cube: any
  cubeGround: any
  pointArray: any[] = []
  vertices: any = []
  constructor(map: any) {
    this.map = map
    this.scene = (window as any).maze.scene
    console.log((window as any).maze.scene)
    this.cubeGround = new THREE.Group()
    this.scene.add(this.cubeGround)
    this.setRayPoint()
  }
  setRayPoint() {
    const size = new GetBox(this.map).getSize()
    console.log(size)
    const x = Math.floor(size.x)
    const z = Math.floor(size.z)
    const y = size.y
    for (let i = 0; i < Math.floor(x / 10); i++) {
      for (let j = 0; j < Math.floor(z / 10); j++) {
        this.pointArray.push(i * 10 - x / 2, y / 10, j * 10 - z / 2)
      }
    }
    this.initPoint()
  }
  initPoint() {

    var geometry = new THREE.BufferGeometry();
    const geo = new THREE.Float32BufferAttribute(this.pointArray, 3)
    geometry.addAttribute('position', geo);
    console.log(geo)
    for (let i = 0; i < geo.count; i++) {
      const v3 = new THREE.Vector3()
      v3.fromArray(geo.array, i * 3)
      this.vertices.push(v3)
    }
    // console.log(this.vertices)
    var material = new THREE.PointsMaterial({
      size: 10,
      // vertexColors: THREE.VertexColors, 
      depthTest: true,
      color: 0xffffff
    });
    var mesh = new THREE.Points(geometry, material);
    this.cubeGround.add(mesh);
    this.rayCaster()
  }
  rayCaster() {
    // 获取主角顶点信息
    var vertices = this.vertices
    // 获取被检测的物体
    const mate = this.map
    const rayArr = []
    mate.children.forEach(child => {
      if (child.name !== 'ground') {
        rayArr.push(child)
      }
    })
    var material = new THREE.LineBasicMaterial({
      color: Math.random() * 0xffffff
    });
    // 循环主角顶点信息
    // console.log(vertices)
    for (var i = 0; i < vertices.length; i++) {
      const star = vertices[i]
      // this.setBox(star)
      // 顶点向量乘以四阶矩阵m   顶点信息的世界矩阵
      var vertexWorldCoord = vertices[i].clone().applyMatrix4(this.cubeGround.matrixWorld); // 主角的世界变换（变换矩阵）
      // 设置一个向量
      var dir = new THREE.Vector3();
      // 将该向量设置为世界坐标与主角位置相减
      dir.subVectors(vertexWorldCoord, star);
      // console.log(vertexWorldCoord)
      const end = new THREE.Vector3().setY(vertexWorldCoord.y)
      // console.log(star.y, end.y)
      var raycaster = new THREE.Raycaster(star, end.clone().negate());
      if (!mate || !mate.children) {
        return
      }
      var intersects = raycaster.intersectObjects(rayArr);
      // var intersectsNegate = rayNegate.intersectObjects(mate.children);
      console.log(intersects)
      // this.setLine(star, end)
      if (intersects.length !== 0) {
        this.setBox(vertices[i])
      }
    }
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

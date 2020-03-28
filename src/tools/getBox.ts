/**
 * 通过传值。返回盒子的外边框临界点和中心点 尺寸
 */
const THREE = require("three");
export default class GetBox {
  public box: any
  win: any = window
  constructor(box) {
    this.box = box;
  }
  // 返回box3
  getBox() {
    let b = new THREE.Box3();
    b.expandByObject(this.box);
    return b;
  }
  // 返回中心点坐标
  getCenter() {
    // console.log(this.box)
    return this.getBox().getCenter(new THREE.Vector3());
  }
  getRayCenter() {
    const c = this.getBox().getCenter(new THREE.Vector3())
    const star = new THREE.Vector3(c.x, c.y, c.z)
    const end = new THREE.Vector3(c.x, c.y - 100, c.z)
    const v3 = new THREE.Vector3()
    var raycaster = new THREE.Raycaster(star, end); // 正向射线
    var intersects = raycaster.intersectObjects([this.box]);
 
    if (intersects.length !== 0) {
      return c
    } else {
      let minLength: number = 0
      let minV3: any = new THREE.Vector3()
      const pArr = this.box.geometry.attributes.position.array
      const pI = this.box.geometry.attributes.position.count

      for (let i = 0; i < pI; i++) {
        const limit = i * 3
        v3.fromArray(pArr, limit)
        let p3 = c.clone().sub(v3); //两点之间的中心点
        let l = p3.length(); // 两点之间的距离
        if (i == 0) {
          minLength = l
          minV3.copy(v3)
        } else {
          if (minLength > l) {
            minLength = l
            minV3.copy(v3)
          }
        }
      }
      return minV3
    }
  }
  point(p,c){
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshBasicMaterial({ color: c });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(p)
    this.win.maze.scene.add(cube);
  }
  line(points){
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var material = new THREE.LineBasicMaterial({
      color: 0x00ff00
    });
    var line = new THREE.Line(geometry, material);
    this.win.maze.scene.add(line);
  }
  // 返回尺寸
  getSize() {
    return this.getBox().getSize(new THREE.Vector3);
  }
  // 矩形表面积
  areaSize(): number {
    let p = this.getSize(),
      a = p.x,
      b = p.z,
      s = a * b;
    return s;
  }
  // 返回vector3是否在当前box3内
  in(p) {
    return this.getBox().containsPoint(p);
  }
}

const THREE = require("three");
import Animate from '../animate/index'
import GetBox from '../tools/getBox';
export default class CreateLead {
  private scene: any
  private lead: any
  private step = 1
  private time = 300
  private rotationMatrix = new THREE.Matrix4();
  private targetQuaternion = new THREE.Quaternion();
  private spherical = new THREE.Spherical()
  private lastCode = 40
  private run = true
  private cube: any
  private code: any
  private boomCode: any
  private camera: any
  private pointArr = []
  private R = 5
  private Boom: boolean = false
  private controls:any
  paddingKey = {
    37: 39,
    38: 40,
    39: 37,
    40: 38,
  }
  constructor(scene: any, camera: any, controls: any) {
    this.scene = scene
    this.camera = camera
    this.controls = controls
  }
  create() {
    var geometry = new THREE.BoxGeometry(this.R, this.R, this.R);
    var material = new THREE.MeshLambertMaterial({
      color: 0x4080ff,
      transparent: true, // 是否透明
      // opacity: 0.2 //透明度 
    });
    this.lead = new THREE.Mesh(geometry, material);
    this.lead.castShadow = true
    this.lead.name = 'lead'
    // this.lead.position.set(235, this.R / 2, 300)

    // this.camera
    // const lookAt = new THREE.Vector3()
    // lookAt.copy(this.lead.position)
    // lookAt.addScalar(150)
    // this.camera.position.copy(lookAt)
    // this.camera.target = lookAt
    // console.log(lookAt)
    // this.camera.matrix.lookAt(this.camera.position, lookAt, this.lead.up)
    // this.camera.lookAt(lookAt)
    // this.camera.updateProjectionMatrix()
    this.scene.add(this.lead);
    this.keyDown(38)
  }
  keyDown(code: number) {
    this.code = code
    // 判断上一次运动是否被终止
    if (!this.boomCode || this.boomCode !== code) {
      // 判断是否需要旋转主角
      if (this.run) {
        this.run = false
        if (this.lastCode === this.code) {
          this.move()
        } else {
          this.generateTarget()
        }
      }
    }
  }
  keyDown1(code: number) {
    console.log(code)
    // 判断上一次运动是否被终止
    this.code = code
    if (this.boomCode) {
      if (this.paddingKey[this.boomCode] === code) {
        this.run = false
        this.generateTarget()  // 被终止后只能往相反方向动
      }
    } else {
      // 判断是否需要旋转主角
      if (this.run) {
        this.run = false
        if (this.lastCode === this.code) {
          this.move()
        } else {
          this.generateTarget()
        }
      }
    }
  }
  generateTarget() {
    const o = {
      37: 1.5,
      38: 1,
      39: 0.5,
      40: 2
    }
    const deg = o[this.code]
    this.lastCode = this.code
    this.spherical.theta = Math.PI * deg;
    this.spherical.phi = Math.PI * 0.5;
    this.spherical.radius = this.step;

    const v3 = new THREE.Vector3()
    v3.setFromSpherical(this.spherical);
    this.rotationMatrix.lookAt(v3, new THREE.Vector3(0, 0, 0), this.lead.up);
    this.targetQuaternion.setFromRotationMatrix(this.rotationMatrix);
    const s = 0, e = 1, t = 200
    new Animate(s, e, t, (tween: any) => {
      this.lead.quaternion.rotateTowards(this.targetQuaternion, tween._object.p);
    }, () => {
      this.move()
    })
  }
  move() {
    const o = {
      37: 'x',
      38: 'z',
      39: 'x',
      40: 'z'
    }
    const star = this.lead.position.clone()
    const end = new THREE.Vector3()
    const cd = o[this.code]
    end.copy(star)
    let b = {
      37: 1,
      38: 1,
      39: 0,
      40: 0
    }
    const s = this.lead.position[cd]
    const st = s - this.step
    const ste = s + this.step
    const e = b[this.code] ? st : ste
    // console.log('en',cd, o[this.paddingKey[this.code]])
    const r = star['x'] > 0  // 右侧
    const d = star['z'] > 0  // 下方
    const l = star['x'] < 0  // 左侧
    const u = star['z'] < 0  // 上方
    // 判断主角所在位置  
    let areaCode: any
    if (r && d) areaCode = 'rd'  //右下
    if (l && d) areaCode = 'ld'  //左下
    if (l && u) areaCode = 'lu'  //左上
    if (r && u) areaCode = 'ru'  //右上
    // 计算偏移量
    if (areaCode === 'rd') {
      b = {
        37: 0,
        38: 0,
        39: 1,
        40: 1
      }
      b[this.code] ? end[cd] : end[cd] -= this.R / 2
    }
    if (areaCode === 'ld') {
      b = {
        37: 1,
        38: 0,
        39: 1,
        40: 1
      }
      b[this.code] ? end[cd] : end[cd] -= this.R / 2
    }
    if (areaCode === 'lu') {
      b = {
        37: 1,
        38: 1,
        39: 0,
        40: 0
      }
      b[this.code] ? end[cd] : end[cd] += this.R / 2
    }
    if (areaCode === 'ru') {
      b = {
        37: 1,
        38: 1,
        39: 1,
        40: 0
      }
      b[this.code] ? end[cd] : end[cd] += this.R / 2
    }
    const lineEnd = new THREE.Vector3()
    lineEnd.copy(end)
    lineEnd[cd] += 10
    this.crteateLine(star, lineEnd)
    // TODO: 判定偏移量
    if (!this.boomCode) {
      this.rayCaster(end)
    }
    if (!this.Boom) {
      this.lead.position[cd] = e
      this.run = true
      this.boomCode = 0
    } else {
      console.log('碰撞了')
      // console.log(s, e)
      const boomS = this.lead.position[cd]
      const boomE = this.lead.position[cd] - (e - s) * this.R / 2
      new Animate(boomS, boomE, this.time, (tween: any) => {
        this.lead.position[cd] = tween._object.p
      }, () => {
        this.Boom = false
        this.run = true
      })
    }
    // console.log(this.lead.position)
    // this.controls.target = this.lead.position

  }
  rayCaster(star: any) {
    // 获取主角顶点信息
    var vertices = this.lead.geometry.vertices
    // 获取被检测的物体
    const mate = this.scene.getObjectByName('mate')

    var material = new THREE.LineBasicMaterial({
      color: Math.random() * 0xffffff
    });
    // 循环主角顶点信息
    for (var i = 0; i < vertices.length; i++) {
      // 顶点向量乘以四阶矩阵m   顶点信息的世界矩阵
      var vertexWorldCoord = vertices[i].clone().applyMatrix4(this.lead.matrixWorld); // 主角的世界变换（变换矩阵）
      // 设置一个向量
      var dir = new THREE.Vector3();
      // 将该向量设置为世界坐标与主角位置相减
      dir.subVectors(vertexWorldCoord, star);
      var raycaster = new THREE.Raycaster(star, dir.clone());
      var rayNegate = new THREE.Raycaster(star, dir.clone().negate());
      // this.crteateLine(star,dir)
      var intersects = raycaster.intersectObjects(mate.children);
      var intersectsNegate = rayNegate.intersectObjects(mate.children);

      if (intersects.length !== 0) {
        if (intersects[0].distance < dir.length()) {
          //循环遍历几何体顶点，每一个顶点都要创建一个射线，进行一次交叉拾取计算，只要有一个满足上面的距离条件，就发生了碰撞
          this.rayFun(intersects[0].point)
        }
      } else if (intersectsNegate.length !== 0) {
        if (intersectsNegate[0].distance < dir.length()) {
          this.rayFun(intersectsNegate[0].point)
        }
      }
    }
  }
  rayFun(point: any) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(point)
    this.scene.add(cube);
    this.boomCode = this.code
    this.Boom = true;
  }
  crteateLine(star: any, end: any) {
    var material = new THREE.LineBasicMaterial({
      color: Math.random() * 0xffffff
    });

    var points = [];
    points.push(star);
    points.push(end.clone());
    var geometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
  createEndPoint(){
    var geometry = new THREE.SphereGeometry( this.R, 4, 4 );
    var material = new THREE.MeshNormalMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.name = 'endPoint'
    this.scene.add( sphere );
  }
}
import GetBox from "../tools/getBox";
import AstarCreate from "../astar/index";
const THREE = require("three");
let mouse = new THREE.Vector2(); //鼠标位置
let count = 0
let star = new THREE.Vector3()
let end = new THREE.Vector3()
export default class HandleBoll {
    event
    scene
    camera
    ground: any
    line
    constructor(event) {
        this.event = event
        this.camera = (window as any).maze.camera
        this.scene = (window as any).maze.scene
        this.ground = this.scene.getObjectByName('ground')
        this.ray()
    }
    ray() {
        mouse.x = (this.event.clientX / document.body.offsetWidth) * 2 - 1;
        mouse.y = -(this.event.clientY / document.body.offsetHeight) * 2 + 1;
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        var intersects = raycaster.intersectObject(this.ground);
        if (intersects.length !== 0) {
            const vector3 = new THREE.Vector3()
            vector3.copy(intersects[0].point)
            const sphere = this.createPoint(vector3)
            this.comPoint(sphere)

        }
    }
    comPoint(mesh) {
        const pointArr = (window as any).vectorArray
        count++
        console.log(count)
        for (let i = 0; i < pointArr.length; i++) {
            const point = pointArr[i]
            const pointInMesh = new GetBox(mesh).in(point)
            if (pointInMesh) {
                mesh.position.copy(point)
                if (count === 1) {
                    star = point
                    end = new THREE.Vector3()
                    break
                } else if (count === 2) {
                    end = point
                    count = 0
                }
            }
        }
        if(star.length()!==0&&end.length()!==0){
            const graph = (window as any).graph
            const pointArr = new AstarCreate(star, end, graph)
            console.log(pointArr)
            this.setLine(pointArr)
        }
    }
    createPoint(p) {
        var geometry = new THREE.SphereGeometry(5, 5, 4);
        var material = new THREE.MeshNormalMaterial({ color: 0xffff00 });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(p)
        sphere.name = 'endPoint'
        this.scene.add(sphere);
        return sphere
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
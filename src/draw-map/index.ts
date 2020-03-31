const THREE = require("three");
import { LoadGltf } from "../loader/index"
import { MapMaterial } from '../materialBall/index'
import ComRayPoint from "../comRayPoint/index";
import GetBox from "../tools/getBox";
export default class DrawMap {
  map: any
  scene: any
  constructor(url: string) {
    this.map = new THREE.Group()
    new LoadGltf(url).create().then((scene: any) => {
      this.scene = (window as any).maze.scene
      this.scene.add(this.map)
      if (scene) {
        scene.traverse((child: any) => {
          child.material = MapMaterial()
          if(child.name === 'ground'){
            child.receiveShadow = true
          } else {
            child.castShadow = true;
          }
        })
      }
      const size = new GetBox(scene).getSize()
      scene.position.setX(size.x/2)
      scene.position.setZ(size.z/2)
      this.scene.add(scene)
      new ComRayPoint(scene)
    })
  }
}
/**
 * @desc 加载器
 */
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../../node_modules/three/examples/jsm/loaders/DRACOLoader.js";
import { SVGLoader } from "../../node_modules/three/examples/jsm/loaders/SVGLoader.js";
interface Loader {
  url: string
  model: any
  loader: any
  create(): void
}
class LoadGltf implements Loader {
  public loader: any | undefined
  public url: string | undefined
  public model: any | undefined
  constructor(url: string) {
    this.url = url
  }
  create() {
    this.loader = new GLTFLoader();
    return new Promise(
      (resolve) => {
        this.loader.setDRACOLoader(new DRACOLoader());
        this.loader.load(this.url, (gltf:any)=> {
          this.model = gltf.scene
          resolve(this.model)
        });
      }
    )
  }
}
class LoadSvg implements Loader {
  public loader: any | undefined
  public url: string | undefined
  public model: any | undefined
  constructor(url: string) {
    this.url = url
  }
  create() {
    this.loader = new SVGLoader();
    return new Promise(
      (resolve) => {
        this.loader.load(this.url, (data:any):void => {
          resolve(data)
        })
      }
    )
  }
}
export {
  LoadGltf,
  LoadSvg
}
const THREE = require("three");
// 地图的材质
export function MapMaterial(){
  return new THREE.MeshLambertMaterial({
    color: 0xC9C9CD,
    side: THREE.DoubleSide,
    transparent: true,
    castShadow: true
  });
}
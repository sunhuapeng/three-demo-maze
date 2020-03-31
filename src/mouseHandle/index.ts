import HandlePoint from './click'
window.addEventListener(
  "click",
  event => {
    var point = (window as any).maze.scene.getObjectByName('POINT_SHAPE')
    new HandlePoint(event, point)
  }
)


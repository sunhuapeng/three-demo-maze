import HandlePoint from './click'
import HandleBoll from './HandleBoll'
window.addEventListener(
  "click",
  event => {
    var point = (window as any).maze.scene.getObjectByName('POINT_SHAPE')
    // new HandlePoint(event, point)
    new HandleBoll(event)
  }
)



const THREE = require("three");
var Graph = (require ('./astar')).Graph 
import * as astar from "./astar";
export default  class AstarCreate{
  result:any
  constructor(star:any,end:any,graph:number[][]){
    var maps = new Graph(graph);
    // console.log(graph)
    let starv3 = new THREE.Vector3()
    let endv3 = new THREE.Vector3()
    star.getWorldPosition(starv3)
    end.getWorldPosition(endv3)
    // TODO: 5 是宽度的一半
    const sx = (Math.floor(starv3.z)-5)/10+graph.length/2
    const sy = (Math.floor(starv3.x)-5)/10+graph.length/2
    const ex = (Math.floor(endv3.z)-5)/10+graph.length/2
    const ey = (Math.floor(endv3.x)-5)/10+graph.length/2
    // console.log(sx,sy,ex,ey)
    var starPosition = maps.grid[sx][sy];
    var endPosition = maps.grid[ex][ey];
    this.result = astar.astar.search(maps, starPosition, endPosition);
    return this.result
  }
}
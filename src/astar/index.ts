
const THREE = require("three");
var Graph = (require ('./astar')).Graph 
import * as astar from "./astar";
export default  class AstarCreate{
  result:any
  constructor(star:any,end:any,graph:number[][]){
    var maps = new Graph(graph);
    // console.log(graph)
    // console.log(star.z)
    // console.log(star.x)
    // console.log(end.z)
    // console.log(end.x)
    // console.log(graph.length)
    // TODO: 5 是宽度的一半
    const sx = (Math.floor(star.x))/10
    const sy = (Math.floor(star.z))/10
    const ex = (Math.floor(end.x))/10
    const ey = (Math.floor(end.z))/10
    // console.log(sx,sy,ex,ey)
    var starPosition = maps.grid[sx][sy];
    var endPosition = maps.grid[ex][ey];
    this.result = astar.astar.search(maps, starPosition, endPosition);
    return this.result
  }
}
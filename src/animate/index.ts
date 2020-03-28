const TWEEN = require("@tweenjs/tween.js");
export default class Animate{
  constructor(s:number, e:number, t:number, ob:any, cb:any){
  const tween = new TWEEN.Tween({ p: s })
  .to({ p: e }, t)
  .easing(TWEEN.Easing.Quadratic.In)
  .start()
  .onUpdate(()=>{
    ob(tween)
  })
  tween.onComplete(() => {
    cb()
  })
}}
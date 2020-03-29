
export default class Load{
    length:number
    load:any
    constructor(){
        this.load = document.querySelector('.loading')
    }
    start():void{
        if(this.load){
            this.load.style.display = 'block'
        }
    }
    end():void{
        if(this.load){
            this.load.style.display = 'none'
        }
    }
}
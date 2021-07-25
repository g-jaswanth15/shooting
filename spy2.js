var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')
var space = document.querySelector("img")

canvas.width = window.innerWidth -10
canvas.height = window.innerHeight -20

// ctx.fillStyle = "rgb(247, 245, 236)"
// ctx.translate(canvas.width/2,canvas.height/2)
// ctx.arc(0,0,20,0,2*Math.PI)
// ctx.fill()


// // let i=1
// for(let i=1;i<=10;i++){
//     j = 36 * i 
//     ctx.moveTo(20*Math.cos((j -10) * (Math.PI /180)),20*Math.sin((j-10) * (Math.PI /180)))
//     ctx.lineTo(30*Math.cos(j * (Math.PI /180)),30*Math.sin(j * (Math.PI /180)))
//     ctx.lineTo(20*Math.cos((j+10) * (Math.PI /180)),20*Math.sin((j+10) * (Math.PI /180)))
//     ctx.fill()
// }

class enemy{
    constructor(x,y){
        this.x = x
        this.y = y
        this.r =(Math.random()*20) +20
        this.velocity = 5
    }

    draw(){

        ctx.fillStyle = "rgb(247, 245, 236)"
        //ctx.fillRect(this.x,this.y,10,10)
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI)
        ctx.fill()

        
        for(let i=1;i<=10;i++){
            let j = 36 * i 
            ctx.beginPath()
            ctx.moveTo(this.x+((this.r)*Math.cos((j -10) * (Math.PI /180))),this.y+((this.r)*Math.sin((j-10) * (Math.PI /180))))
            ctx.lineTo(this.x+(((this.r)+10)*Math.cos(j * (Math.PI /180))),this.y+((this.r+10)*Math.sin(j * (Math.PI /180))))
            ctx.lineTo(this.x+((this.r)*Math.cos((j+10) * (Math.PI /180))),this.y+((this.r)*Math.sin((j+10) * (Math.PI /180))))
            ctx.fill()
        }
    }

    update(){
        this.draw()
        this.x += this.velocity
        this.y += this.velocity
    }
}
enemies = []

function moreEnemies(){
    setInterval(() => {
        enemies.push(new enemy(Math.random()*canvas.width,Math.random()*canvas.height))
    }, 1000);
    
}
function moving(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
  
    enemies.forEach(eny => {
        eny.update()
    })
    requestAnimationFrame(moving)
}
moving()
moreEnemies()


var canvas = document.getElementById("canvas")
var ctx = canvas.getContext('2d')
var space = document.querySelector("img")

canvas.width = window.innerWidth -10
canvas.height = window.innerHeight -20

const traingle_size = { 
    width: 40,
    height: 40 
};
const trinagle_position = { 
    x: canvas.width/2-10,
    y: canvas.height/2 +400
};
const THRUST = 2;
class enemy{
    constructor(x,y){
        this.x = x
        this.y = y
        this.r =(Math.random()*20) +20
        this.velocity = 5
    }

    draw(){

        ctx.beginPath()
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
        this.x -= 2
    }
}

function moreEnemies(){
    setInterval(() => {
        enemies.push(new enemy(canvas.width,Math.random()*canvas.height))
    }, 1000);
    
}
class player{
    constructor(size, position) {
        this.color = 'red';
        this.size = size;
        this.position = position;
        this.angle = 0;
        this.engineOn = false;
        this.engineback = false;
        this.rotatingLeft = false;
        this.rotatingRight = false;
        this.velocity = {
          x: 0,
          y: 0,
        }
    }
    draw1(){
        const triangleCenterX = this.position.x + 0.5 * this.size.width;
        const triangleCenterY = this.position.y + 0.5 * this.size.height;
  
        ctx.save();
        ctx.rotate(this.angle);
        ctx.translate(triangleCenterX, triangleCenterY);
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Triangle
        ctx.fillStyle = this.color
        ctx.moveTo(0, -this.size.height / 2);
        ctx.lineTo(-this.size.width / 2, this.size.height / 2);
        ctx.lineTo(this.size.width / 2, this.size.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "green";
        ctx.fillRect(-this.size.width / 2 +10, this.size.height / 2,20,20)

        // Flame for engine
        if (this.engineOn) {
            const fireYPos = this.size.height / 2 + 5;
            const fireXPos = this.size.width * 0.25;
            ctx.beginPath();
            ctx.moveTo(-fireXPos, fireYPos);
          ctx.lineTo(fireXPos, fireYPos);
          ctx.lineTo(0, fireYPos + Math.random() * 50);
          ctx.lineTo(-fireXPos, fireYPos);
            ctx.closePath();
            ctx.fillStyle = 'orange';
            ctx.fill();
          }
          ctx.restore();
    }

    updateSpaceShip() {
        // Angle has to be in radians
        const degToRad = Math.PI / 180;
        // Change the position based on velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Move spaceship to other side when leaving screen
        this.position.x = (canvas.width + this.position.x) % canvas.width;
        this.position.y = (canvas.height + this.position.y) % canvas.height;
        // Turning
        if (this.rotatingLeft) this.angle -= degToRad;
        if (this.rotatingRight) this.angle += degToRad;
        // Acceleration
        if (this.engineOn) {
          this.velocity.x += (THRUST / 200) * Math.sin(this.angle);
          this.velocity.y -= (THRUST / 200) * Math.cos(this.angle);
        }
        if(this.engineback){
            this.velocity.x -= (THRUST / 100) * Math.sin(this.angle);
            this.velocity.y += (THRUST / 100) * Math.cos(this.angle);
        }
    }
}

const spaceship = new player(traingle_size,trinagle_position)

function handleKeyInput(event) {
    const { keyCode, type } = event;
    const isKeyDown = type === 'keydown' ? true : false;

    if (keyCode === 37) spaceship.rotatingLeft = isKeyDown;
    if (keyCode === 39) spaceship.rotatingRight = isKeyDown;
    if (keyCode === 38) spaceship.engineOn = isKeyDown;
    if (keyCode === 40) spaceship.engineback = isKeyDown;
}

class bombs{
    constructor(x,y,velocity){
        this.x = x
        this.y = y
        this.radius =5
        this.color = "white"
        this.velocity = velocity
    }

    draw2(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI)
        ctx.fillStyle = "white"
        ctx.fill()
    }

    update(){
        this.draw2()
        this.x = this.x +this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

var enemies = []
var shootingbombs = []

function moving(){
    ctx.clearRect(0,0,canvas.width,canvas.height)

    spaceship.updateSpaceShip()
    spaceship.draw1()
    
    enemies.forEach(eny => {
        eny.update()
    })
    shootingbombs.forEach(shoot =>{
        shoot.update()
    })
    requestAnimationFrame(moving)

    console.log(spaceship.angle)
}


moreEnemies()

// Event Listeners
document.addEventListener('keydown', handleKeyInput);
document.addEventListener('keyup', handleKeyInput);


document.addEventListener("keyup",event =>{
    if(event.keyCode == 32){
            shootingbombs.push(new bombs(
                (0.5* spaceship.size.width +  spaceship.position.x),
                (0.5* spaceship.size.height +   spaceship.position.y),
                {
                    x:spaceship.angle,
                    y:spaceship.angle
                }
            ))
    }    
})

moving()



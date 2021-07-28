const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.style.display = "none"
canvas.width = innerWidth
canvas.height = innerHeight
const spaceshipSize = { width: 20, height: 30 };
const spaceshipPosition = { x: 100, y: canvas.height /2 };
const THRUST = 2;
var shootmusic = document.getElementById("music")
var fire = document.getElementById("music2")
var score =0;
document.getElementById('tryagain').style.display = "none"
document.getElementById("start").addEventListener("click",()=>{

    document.querySelector("#startgame").style.display = "none"

    var highscore = localStorage.getItem("best")

    var bestscore = highscore
  canvas.style.display = "block"

  var enemies = []
  class enemy{
    constructor(x,y){
        this.x = x
        this.y = y
        this.r =(Math.random()*15) +5
        this.velocity = 5
    }

    draw(){

      context.beginPath()
      context.fillStyle = "rgb(247, 245, 236)"
      //ctx.fillRect(this.x,this.y,10,10)
      context.arc(this.x,this.y,this.r,0,2*Math.PI)
      context.fill()

      
      for(let i=1;i<=10;i++){
          let j = 36 * i 
          context.beginPath()
          context.moveTo(this.x+((this.r)*Math.cos((j -10) * (Math.PI /180))),this.y+((this.r)*Math.sin((j-10) * (Math.PI /180))))
          context.lineTo(this.x+(((this.r)+10)*Math.cos(j * (Math.PI /180))),this.y+((this.r+10)*Math.sin(j * (Math.PI /180))))
          context.lineTo(this.x+((this.r)*Math.cos((j+10) * (Math.PI /180))),this.y+((this.r)*Math.sin((j+10) * (Math.PI /180))))
          context.fill()
      }

    }

    update(){
      this.draw()
      this.x -= 2
    }
  }

  function moreEnemies(){
    setInterval(() => {
        enemies.push(new enemy(canvas.width,Math.random()*(canvas.height -100) +100))
    }, 1000);   
  }

  class SpaceShip {
    constructor(size, position) {
      this.color = 'rgb(202, 30, 17)';
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
      };
    }

    draw() {
      const triangleCenterX = this.position.x + 0.5 * this.size.width;
      const triangleCenterY = this.position.y + 0.5 * this.size.height;

      context.save();
      context.translate(triangleCenterX, triangleCenterY);
      context.rotate(this.angle);
      context.lineWidth = 1;
      context.beginPath();
      // Triangle
      context.moveTo(0, -this.size.height / 2);
      context.lineTo(-this.size.width / 2, this.size.height / 2);
      context.lineTo(this.size.width / 2, this.size.height / 2);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();

      context.fillStyle = "lightgreen"
      context.arc(0,0,5,0,2*Math.PI)

      context.fillStyle = "green";
      context.fillRect(-this.size.width / 2 +5, this.size.height / 2,10,10)

      context.fillStyle = "black"
      context.arc(0,0,this.size.height/2,0,Math.PI *2)

      context.fillStyle = "white"
      context.arc(0,0,5,0,2*Math.PI)
      

      // Flame for engine
      if (this.engineOn) {
        const fireYPos = this.size.height / 2 + 10;
        const fireXPos = this.size.width * 0.25;
        context.beginPath();
        context.moveTo(-fireXPos, fireYPos);
        context.lineTo(fireXPos, fireYPos);
        context.lineTo(0, fireYPos + Math.random() * 50);
        context.lineTo(-fireXPos, fireYPos);
        context.closePath();
        context.fillStyle = 'orange';
        context.fill();
      }
      context.restore();
    }

    updateSpaceShip() {
      // Angle has to be in radians
      const degToRad = Math.PI / 180;
      // Change the position based on velocity
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      // Move spaceship to other side when leaving screen
      //this.position.x = (canvas.width + this.position.x) % canvas.width;
      //console.log((canvas.width + this.position.x) % canvas.width)
      
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

  const spaceShip = new SpaceShip(spaceshipSize, spaceshipPosition);

    
  function keys(event) {
    const { keyCode, type } = event;
    const isKeyDown = type === 'keydown' ? true : false;

    if (keyCode === 37) spaceShip.rotatingLeft = isKeyDown;
    if (keyCode === 39) spaceShip.rotatingRight = isKeyDown;
    if (keyCode === 38){
        spaceShip.engineOn = isKeyDown;
        fire.play()
    } 
    if (keyCode === 40) spaceShip.engineback = isKeyDown;
  }

  class bombs{
    constructor(x,y,velocity){
        this.x = x
        this.y = y
        this.radius =5
        this.color = "cyan"
        this.velocity = velocity
    }

    draw2(){
        context.beginPath()
        context.arc(this.x,this.y,this.radius,0,2 * Math.PI)
        context.fillStyle = "cyan"
        context.fill()
    }

    update(){
        this.draw2()
        this.x = this.x +this.velocity.x
        this.y = this.y + this.velocity.y
    }
  }

  var shootingbombs = []

  function moving() {
      // Clear screen
      context.fillStyle = "rgb(0,0,0)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      spaceShip.updateSpaceShip();
      // Begin drawing
      spaceShip.draw();
      // Repeat
      var animate =requestAnimationFrame(moving);

      if(score>highscore || highscore==null){
        bestscore=Math.floor(score)
    }
    else if(highscore>score){
        bestscore=highscore
    }
      scoreboard()
      if((canvas.width + spaceShip.position.x) % canvas.width < 3){
        stoping()
      }

      shootingbombs.forEach((shoot,index) =>{
        shoot.update()
        if(shoot.x - shoot.radius <0 ||
          shoot.x - shoot.radius >canvas.width ||
          shoot.y - shoot.radius <0 ||
          shoot.y - shoot.radius >canvas.height){
          setTimeout(() =>{
            shootingbombs.splice(index,1)
          },0)
        }
    })

      enemies.forEach((eny,enyindex) => {
        eny.update()

      const dist1 = Math.hypot(
        (0.5* spaceShip.size.width +  spaceShip.position.x) - eny.x ,
        (0.5* spaceShip.size.height +   spaceShip.position.y) -eny.y
      )

      if((dist1 - spaceShip.size.height/2 - eny.r)<1){
        stoping()
      }
      shootingbombs.forEach((shoot,index) =>{
        const dist = Math.hypot(shoot.x - eny.x , shoot.y -eny.y)

        if((dist - shoot.radius - eny.r -10) < 1){
          if(eny.r -5 >10){
            eny.r -=5
            setTimeout(() =>{
              shootingbombs.splice(index,1)
            },0)
            score += 20
          }
          else{
            setTimeout(() =>{
              shootingbombs.splice(index,1)
              enemies.splice(enyindex,1)
            },0)
            score += 20 
          }
          console.log(score)
        }
      })
    })

    function scoreboard(){

        context.fillStyle = "rgb(4, 82, 248)"
        context.font = "bold 40px Arial"
        context.fillText(" SCORE : ",canvas.width-290,50)
        context.fillText("THE BEST :",40,50)
        context.fillStyle ="rgb(248, 4, 236)"
        context.fillText( score,canvas.width-100,50)
        context.fillText(bestscore,270,50)

      }
    
    function stoping(){
        shootmusic.pause()
        fire.pause()
        cancelAnimationFrame(animate) //canceling the animation of game
        document.getElementById("startgame").style.display = "block"
        document.getElementById("start").style.display = "none"
        var totalscore = score ;//score
        document.getElementById("tryagain").style.display = "block"
        document.getElementById('score').innerText = "🎉SCORE :" + totalscore +"🎉"
        document.getElementById('tryagain').addEventListener('click',()=>{
        window.location.reload(true)
        })
        canvas.style.display = "none"

        //updating score in localstorage
        if(localStorage.getItem("best") == null){
        localStorage.setItem("best",totalscore)
        var highscore = localStorage.getItem("best")
            document.getElementById('highscore').innerText = "🔥BEST :" + highscore +"🔥"
        }
        else if(totalscore > localStorage.getItem('best')){
            localStorage.setItem("best",totalscore)
            var highscore = localStorage.getItem("best")
            document.getElementById('highscore').innerText = "🔥BEST :" + highscore +"🔥"
        }
        else{
            var highscore = localStorage.getItem("best")
        document.getElementById('highscore').innerText ="🔥BEST :" + highscore +"🔥"
        }
        } 
  }

    // Event Listeners
    document.addEventListener('keydown', keys);
    document.addEventListener('keyup', keys);
    // Start the game

    document.addEventListener('keyup', ()=>{
      if(event.keyCode == 32){
        spaceShip.velocity.x = 0
        spaceShip.velocity.y = 0
      } 
    })
  document.addEventListener("click",event =>{
    const distbtwangle = Math.atan2
    (event.clientY - (0.5* spaceShip.size.height +   spaceShip.position.y),
    event.clientX - (0.5* spaceShip.size.width +  spaceShip.position.x)
    )
    shootmusic.play()
    shootingbombs.push(new bombs(
        (0.5* spaceShip.size.width +  spaceShip.position.x),
        (0.5* spaceShip.size.height +   spaceShip.position.y),
        {
          x: Math.cos(distbtwangle) *5,
          y:Math.sin(distbtwangle) *5
        }
    ))
  })
  moreEnemies()
  moving();
})



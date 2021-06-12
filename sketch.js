//declaring states of the game

var PLAY = 1;
var END = 0;
var gameState = PLAY;

//declaring variables
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//declaring groups and images, variables...
var cloudsGroup, cloudImage1, cloudImage2;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;

//declaring image of the background
var backgroundImg;

//letting score be 0
var score = 0;

//declaring sounds for the game
var jumpSound, collidedSound;

//declaring variables
var gameOver, restart;

//function to load Image, Sounds, etc...
function preload(){  
  //loading background Image
  backgroundImg = loadImage("bgImage.jpg")
  
  //loading trex Image and animation
  trex_running = loadAnimation("TREX1.png","TREX2.png","TREX3.png","TREX4.png","TREX5.png");
  trex_collided = loadAnimation("TREX3.png");
  
  //loading ground Image  
  groundImage = loadImage("ground.png");
  
  //loading clouds Images
  cloudImage1 = loadImage("cloud1.png");
  cloudImage2 = loadImage("cloud2.png");
  
  //loading obstacles Images
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  
  //loading game Sounds
  jumpSound = loadSound("jump.mp3");
  collidedSound = loadSound("collided.mp3");
  
  //loading game Images
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

//setup function -
function setup(){
  //creating the canvas
  var outputScreen = createCanvas(windowWidth, windowHeight);
  
  //creating ground - 
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/4;
  ground.velocityX = -(6 + 3*score/100);
  
  //creating invisible ground - 
  invisibleGround = createSprite(width/2,height+10,width,125);   
  invisibleGround.visible = false;
  
  //creating trex - 
  trex = createSprite(75,height-40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,40);
  trex.scale = 0.8;

  //creating sprites -   
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  gameOver.scale = 0.6;
  restart.scale = 0.4;
  gameOver.visible = false;
  restart.visible = false;

  //creating the groups -
  cloudsGroup = new Group();
  obstaclesGroup = new Group();

}

//draw function
function draw() {

//background -
  background(backgroundImg);

  //setting the game camera
  camera.x = trex.x;
  gameOver.position.x = restart.position.x = camera.x;

//displaying score
  textSize(20);
  stroke("yellow");
  fill("red")
  text("Points: "+ score,30,50);
  
//GAME STATE -  
  if (gameState===PLAY){
    //increasing the score
    score = score + Math.round(getFrameRate()/60);
    //increasing speed of the ground
    ground.velocityX = -(6 + 3*score/100);
    
    //command for jumping
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120){

      //playing jumpSound
      jumpSound.play();
      //giving velocity
      trex.velocityY = -15;
      
      touches = [];
    }
    
    //increasing velocity
    trex.velocityY = trex.velocityY + 0.8
  
    //making a infinite ground -
    if (ground.x < 0){
      ground.x = ground.width/4;
    }
  
    //colliding with the invisible ground
    trex.collide(invisibleGround);

    //calling functions -
    spawnClouds();
    spawnObstacles();
  
    //chnaging gameState
    if(obstaclesGroup.isTouching(trex)){
      //playing collidedSound
      collidedSound.play();
      //gameState as END
      gameState = END;
    }
  }
  //GAME STATE -
  else if (gameState === END){
    //making gameOver and Restart visible
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //........
    if(touches.length>0 || mousePressedOver(restart)) {      
      reset();
      touches = []
    }

    //showing Game Ends in consle
    console.log("Game Ends");
  }
  
  //drawing all the sprites
  drawSprites();
}

//spawnClouds function -
function spawnClouds() {
  //creating clouds randomly
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+20,height-500,40,10);
    var r = Math.round(random(1,2));
    switch(r) {
      case 1: cloud.addImage(cloudImage1);
              break;
      case 2: cloud.addImage(cloudImage2);
              break;       
      default: break;
    }
    //.....
    cloud.y = Math.round(random(100,220));
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assigning lifetime to the variable
    cloud.lifetime = 300;
    
    //adjusting the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //adding each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

//spawnObstacles function -
function spawnObstacles(){
  //creating the obstacles
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    //seting collider
    obstacle.setCollider('circle',0,0,45)
  
    //increasing velocity
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generating random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;            
      default: break;
    }
    
    //assigning scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //adding each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

//reset function -
function reset(){
  
  //changing gameState
  gameState = PLAY;
  //making visible
  gameOver.visible = false;
  restart.visible = false;
  
  //destroying obstacles and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //changing trex Animation
  trex.changeAnimation("running",trex_running);
  
  //score as 0
  score = 0;

  //showing game starts again in console
  console.log("Game Starts again...Go ahead!!");
}

//END
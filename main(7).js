var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

// set up some event handlers to process keyboard input
window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false);
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);


var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime() //only call function once per frame

{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	
	var deltaTime = (startFrameMillis - endFrameMillis)*0.001;
	if (deltaTime > 1) //validate that delta is within range
	{
		deltaTime = 1;
		
	}
	return deltaTime;
}


// define some constant values for the game states
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_SPLASH;

var spawnTimer = 2;
var shootTimer = 0;

// load the image to use for the tiled background
var grass = document.createElement("img");
grass.src = "grass.png";

//create the tiled background
var background = [];

for(var y=0;y<15;y++)
{
background[y] = [];
for(var x=0; x<20; x++)
background[y][x] = grass;
}
var splashTimer = 3; 

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var ASTEROID_SPEED = 3;
var PLAYER_SPEED = 2;
var PLAYER_TURN_SPEED = 0.04;
var BULLET_SPEED = 3;

var player = {
	image:document.createElement("img"),
	x: SCREEN_WIDTH/2,
y: SCREEN_HEIGHT/2,
width: 93,
height: 80,
directionX: 0,
directionY: 0,
angularDirection: 0,
rotation: 0,
isDead: false
};
//set the image for the payer to use
player.image.src = "ship.png";

//create an array to store our asteroids
var asteroids = [];
//rand(floor, ceil)
//return a random number within the range of the two
//input variables
function rand(floor, ceil)
{
	return Math.floor( (Math.random()* (ceil-floor)) +floor);
}

//create a new random asteroid and add it to our asteroid array.
//we'll give the asteroid a random position (just off screen) and
//set it moving toward the centre of the screen

function spawnAsteroid() 
{
	//make a random variable to specify which asteroid image to use
        //small, medium or large
		var type = rand(0, 3);
		
		//create new asteroid
		var asteroid = {};
		
		asteroid.image = document.createElement("img");
		asteroid.image.src = "rock_large.png";
		asteroid.width = 69;
		asteroid.height = 75;
		 //to set a random position just off screen, we'll start at the centre of the
        //screen then move in a random direction by the width of the screen
		var x = SCREEN_WIDTH/2;
		var y = SCREEN_HEIGHT/2;
		
		var dirX = rand(-10, 10);
        var dirY = rand(-10, 10);
		//normalise the direction (the hypotenuse of the triangle formed
        //by x,y will equal 1)
        var magnitude = (dirX * dirX) + (dirY * dirY);
        if(magnitude != 0)
		{
			var oneOverMag = 1 / Math.sqrt(magnitude);
			dirX *= oneOverMag;
			dirY *= oneOverMag;
			
		}
		 //now we can multiple the dirX/Y by the screen width to move that amount from
        //the centre of the screen
        var movX = dirX * SCREEN_WIDTH;
        var movY = dirY * SCREEN_HEIGHT;
		
		 //add the direction to the original position to get the starting
        //position of the asteroid
        asteroid.x = x + movX;
        asteroid.y = y + movY;
       
	    //now the easy way to set the velocity so that the asteroid moves
        //towards the centre of the screen is to just reverse the direction we found earlier
        asteroid.velocityX = -dirX * ASTEROID_SPEED;
        asteroid.velocityY = -dirY * ASTEROID_SPEED;
		
		//finally we can add our new asteroid to the end of our asteroid array
        asteroids.push(asteroid);
}

//create all the bullets in our game
var bullets = [];
var shoot = false

//tests if two rectangles are intersection.
// Pass in the x,y coordinates, width and height of each triangle,
// return 'true if the rectangles are intersecting
function intersects  (x1, y1, w1, h1, x2, y2, w2, h2)
{
	 if(y2 + h2 < y1 ||
                x2 + w2 < x1 ||
                x2 > x1 + w1 ||
                y2 > y1 + h1)
				{
					 return false;
				}
				return true;
}

function runSplash(deltaTime)
{
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		gameState = STATE_GAME;
		return;
	}
	context.fillStyle = "#000";
	context.font="24px Arial";
	context.fillText("SPLASH SCREEN", 200, 240);
}

function run()
{
	context.fillStyle = "#ccc";
	context.fillRect(0,0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
// draw the tiled background (make sure you do this first, so everything
// else in the scene will be drawn on top of the tiled background)
for(var y=0; y<15; y++)
{
for(var x=0; x<20; x++)
{
context.drawImage(background[y][x], x*32, y*32);
}
}
}
     function updateBullets(deltaTime)
	 {
	//update the shoot timer
if(shootTimer > 0)
	shootTimer -= deltaTime;

// update all the bullets
for(var i=0; i<bullets.length; i++)	
{
	bullets[i].x += bullets[i].velocityX;
	bullets[i].y += bullets[i].velocityY;
	
}
if(shoot == false && shootTimer <= 0)
{
	 for(var i=0; i<bullets.length; i++)
	 {
		 //check if the bullet has gone out of screen boundaries
                //and if so kill it
                if(bullets[i].x < -bullets[i].width ||
                bullets[i].x > SCREEN_WIDTH ||
                bullets[i].y < -bullets[i].height ||
                bullets[i].y > SCREEN_HEIGHT)
				{
					//remove 1 element at position i
                        bullets.splice(i, 1);
                        //because we are deleting elements from the middle of the
                        //array, we can only remove 1 at a time. So, as soon as we
                        //remove 1 bullet stop.
                        break;
				}
	 }
}
	 }
	 function drawImage()
	 {
		 
// draw all the bullets
for(var i=0; i<bullets.length; i++)
{
	context.drawImage(bullets[i].image,
	bullets[i].x - bullets[i].width/2,
	bullets[i].y - bullets[i].height/2);
}

//draw all the asteroids
        for(var i=0; i<asteroids.length; i++)
		{
			context.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
		}	
	 }
	 
	 function updateAsteroidsArray(deltaTime)
	 {
 //update all the asteroids in the asteroids array
        for(var i=0; i<asteroids.length; i++)
		{
			  //update the asteroids position according to its current velocity.
                //TODO: don't forget to multiply by deltaTime to get a constant speed
                asteroids[i].x += asteroids[i].velocityX;
                asteroids[i].y += asteroids[i].velocityY;
		
		
		//TODO:check if the asteroid has gone out of the screen boundaries
                //if so, wrap the asteroid around the screen so it comes back from
                //the other side
			
				if(asteroids[i].x + asteroids[i].width +30 <
				   asteroids[i].width/2)
				   {
					   asteroids[i].x = SCREEN_WIDTH;
				   }
				   if(asteroids[i].y + asteroids[i].height +30 <
				   asteroids[i].width/2)
				   {
					   asteroids[i].y = SCREEN_HEIGHT;
				   }
}
	 }

function updatePlayer()
{
	
//Stop Player leaving the screen
        //for player to go right
		if(player.x > (SCREEN_WIDTH - player.width) + 45) 

{
                player.x = (SCREEN_WIDTH - player.width) + 45;
        }
		//player to go left
        if(player.x < 40)
			{
                player.x = 40
        }
		 //player to go down
        if(player.y > (SCREEN_HEIGHT - player.height) + 45) 
 {
                player.y = (SCREEN_HEIGHT - player.height) + 45;
        }
		//player to go up
        if(player.y < 40)
        {
                player.y = 40
        }
		
		//calculate sin and cos for the player's current rotation
        if (player.isDead == false)
		{
		var s = Math.sin(player.rotation);
                var c = Math.cos(player.rotation);
				
				//this will make the ship move in direction of rotation
                var xDir = (player.directionX * c) - (player.directionY * s);
                var yDir = (player.directionX * s) + (player.directionY * c);
                var xVel = xDir * PLAYER_SPEED;
                var yVel = yDir * PLAYER_SPEED;
				
				 player.x += xVel;
                player.y += yVel;
               
			      player.rotation += player.angularDirection * PLAYER_TURN_SPEED;

				  
                //make the ship use angles - by rotating canvas and restoring
                //to normal image
				 context.save();
                        context.translate(player.x, player.y);
                        context.rotate(player.rotation);
                        context.drawImage(
                                        player.image, -player.width/2, -player.height/2);
                        context.restore();
}
}
	function isDead()			
	{
	//check if any bullet intersects any asteroid. If so, kill them both
        for(var i=0; i<asteroids.length; i++)
        {
                for(var j=0; j<bullets.length; j++)
                {
                        if(intersects(
                                bullets[j].x, bullets[j].y,
                                bullets[j].width, bullets[j].height,
                                asteroids[i].x, asteroids[i].y,
                                asteroids[i].width, asteroids[i].height) == true)
                        {
                                asteroids.splice(i, 1);
                                bullets.splice(j, 1);
                                break;
                        }
                }
        }
		//kill player when hit by asteroid
        for(var i=0; i<asteroids.length; i++)
        {
                if(player.isDead == false)
                {
                        if(intersects(
                                player.x, player.y,
                                player.width/2, player.height/2,
                                asteroids[i].x, asteroids[i].y,
                                asteroids[i].width, asteroids[i].height) == true)
                        {
                                asteroids.splice(i, 1);
                                player.isDead = true;
								gameState = STATE_GAMEOVER;
                                break;
                        }
                       
                }
        }
}
	function playerShoot()
{
        var bullet = {
			image: document.createElement("img"),
			x: player.x,
			y: player.y,
			width: 5,
			height: 5,
			velocityX: 0,
			velocityY: 0
		};
		
		bullet.image.src = "bullet.png"
       
        //start off with a velocity that shoots the bullet straight up
        var velX = 0;
        var velY = 1;
       
        //now rotate this vector according to the ship's current location
        var s = Math.sin(player.rotation);
        var c = Math.cos(player.rotation);
       
        //for an explanation of formula visit
        //http://en.wikipedia.org/wiki/Rotation_matrix
        var xVel = (velX * c) - (velY * s);
        var yVel = (velY * s) + (velY * c);
       
        //don't bother about storing direction and calculating the
        //velocity every frame, because it won't change.
        //Just store the pre-calculate velocity
        bullet.velocityX = xVel * BULLET_SPEED;
        bullet.velocityY = yVel * BULLET_SPEED;
       
        // add the bullet to the bullets array
		bullets.push(bullet);
}

//key constants - allows your ship to move to assigned keys
var KEY_SPACE = 32
var KEY_LEFT = 37
var KEY_UP = 38
var KEY_RIGHT = 39
var KEY_DOWN = 40
			
	function run ()
	
	{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
		     runSplash(deltaTime);
			 break;
	    case STATE_GAME:
		     runGame(deltaTime);
			 break;
	    case STATE_GAMEOVER:
		     runGameOver(deltaTime);
			 break;
	}
}	

function runGame(deltaTime)
	
	{
	spawnTimer -= deltaTime;
	if(spawnTimer <= 0)
	{
		spawnTimer = 1;
		spawnAsteroid();
	}
	updateBullets(deltaTime);
	updateAsteroidsArray();
	drawImage();
	updatePlayer();
	isDead();
}

var gameOverTimer = 2;
function runGameOver(deltaTime)
{
	gameOverTimer -= deltaTime
	
	context.fillStyle = "#FF0000";
	context.font = "100px Times New Roman";
	context.fillText("GAME OVER" , 60, 200);
}
	
function onKeyDown(event)
{
        if(event.keyCode == KEY_UP)
        {
                player.directionY = 1;
        }
        if(event.keyCode == KEY_DOWN)
        {
                player.directionY = -1;
        }
        if(event.keyCode == KEY_LEFT)
        {
                player.angularDirection = -1;
        }
        if(event.keyCode == KEY_RIGHT)
        {
                player.angularDirection = 1;
        }
        if(event.keyCode == KEY_SPACE && shootTimer <= 0)
        {
                shootTimer += 0.3;
                playerShoot();
        }
        if(event.keyCode == KEY_SPACE)
        {
                shoot = true;
        }
}

	 
function onKeyUp(event)
{
        if(event.keyCode == KEY_UP)
        {      
                player.directionY = 0;
        }
        if(event.keyCode == KEY_DOWN)
        {      
                player.directionY = 0;
        }
        if(event.keyCode == KEY_LEFT)
        {
                player.angularDirection = 0;
        }
        if(event.keyCode == KEY_RIGHT)
        {
                player.angularDirection = 0;
        }
        if(event.keyCode == KEY_SPACE)
        {
                shoot = false;
        }
}
				

//60FPS framework
(function()
{
var onEachFrame;
 
if (window.requestAnimationFrame)
{
  onEachFrame = function(cb)
  {
   var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
   _cb();
  };
 
}
else if (window.mozRequestAnimationFrame)
        {
        onEachFrame = function(cb) {
                var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
                _cb();
        };
       
}
else
{
        onEachFrame = function(cb)
        {
                setInterval(cb, 1000 / 60);
        }
}
 
        window.onEachFrame = onEachFrame;
})();
 
window.onEachFrame(run);
		
		
		
		
		
		
		
		
	
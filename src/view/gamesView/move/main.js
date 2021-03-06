// Move Game
game = function(){

//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//---------------- frame id
let frameId;
//--------------- pressed key
let keys = [];
//---------------- offscreen render
let preCanvas = document.createElement("canvas");
let preRender = preCanvas.getContext("2d"); // pre render

//---------------- game options
let fps = 60;

//--------------- game Options dom elements
const opt = $('#options .options-content');
let optWrapper;

function createOptions(){
    optWrapper = $("<div class='row'></div>"); // create wrapper 
    $(opt).append( optWrapper );
    $(optWrapper).append( ` 
    <div class="row">
        <div class="input-field col s12">
            <i class="material-icons prefix">slow_motion_video</i>
            <input id="moveFps" type="number" class="validate valid" value="${fps}">
            <label for="moveFps" class="trans active" data-trans="moveFps"></label>
        </div> 
    </div>
    `);
    $('#moveFps').on('change', ()=>{
        if( $( '#moveFps' ).val() > 0  ){
            fps = Number($( '#moveFps' ).val());
            interval = 1000/fps;
        }   
    });
}

function destroyOptions(){
    $( optWrapper ).empty();
}

let Player = function( x, y){
    this.x = x;
    this.y = y;
    this.vel = {
        x:0,
        y:0
    };
    this.speed = 9;
    this.friction = 0.9;
    this.color = "#2980B9";
    this.radius = 10;
}

Player.prototype.draw = function(){
    preRender.beginPath();
    preRender.fillStyle = this.color;
    preRender.arc( this.x, this.y, this.radius, 0, Math.PI*2);
    preRender.fill();
};

Player.prototype.animate = function( keys ){
    if (keys[38] && this.vel.y > -this.speed)
        this.vel.y--;
    
    if (keys[40] && this.vel.y < this.speed ) 
        this.vel.y++;
        
    if (keys[39] && this.vel.x < this.speed ) 
        this.vel.x++;
        
    if (keys[37] && this.vel.x > -this.speed)  
        this.vel.x--;
     
    this.vel.x *= this.friction;
    this.vel.y *= this.friction;

    this.x += this.vel.x;
    this.y += this.vel.y;

    if( this.x < this.radius ) this.x = this.radius;
    if( this.x > canvas.width - this.radius ) this.x = canvas.width - this.radius;

    if( this.y < this.radius ) this.y = this.radius;
    if( this.y > canvas.height-this.radius ) this.y = canvas.height-this.radius;

    this.draw();    
};

let Enemi = function( ){
    this.x;
    this.y; // ceneter point 
    this.size = {
        width: 0,
        height: 0
    }; 
    this.vel;

    this.init();
};

Enemi.prototype.color = "#E74C3C";

Enemi.prototype.init = function(){
    this.x = help.randInt(0,canvas.width);
    this.y = help.randInt(-50,0);
    this.size.width =  help.randInt(20,70);
    this.size.height = help.randInt(20,70);
    this.vel = help.randInt( 3, 6);
};
Enemi.prototype.draw = function(){
    preRender.fillStyle = this.color;
    preRender.fillRect(this.x - this.size.width/2, this.y-this.size.height/2,this.size.width,this.size.height);
};

Enemi.prototype.animate = function(){
    this.y += this.vel;
    if( this.y > canvas.height + this.size.height )
        this.init();
    this.draw();
};

Enemi.prototype.isCollision = function( player ){
    let w2 = this.size.width/2;
    let h2 = this.size.height/2;

    let distX = Math.abs( player.x - this.x );
    let distY = Math.abs( player.y - this.y );

    if( distX > ( w2 + player.radius) ) return false;
    if( distY > ( h2 + player.radius) ) return false;

    if( distX <= w2 ) return true;
    if( distY <= h2 ) return true;

    let dx = distX - w2;
    let dy = distY - h2;

    return ( dx * dx + dy * dy <= player.radius * player.radius );
};

//---------------- change size
function resize(){
    canvas.height = $(gameContainer).innerHeight();
    canvas.width = $(gameContainer).innerWidth();   

    preCanvas.height = canvas.height;
    preCanvas.width = canvas.width;
}

let player;
let enemies = [];
let score = 0;
let lastTime;
function init(){
    resize();
    player = new Player( canvas.width/2,canvas.height - canvas.height/4); // creat player object
    enemies = [];
    for( let i = 0; i < 40; i++ )
        enemies.push( new Enemi() );
    score = 0;
    lastTime = null;
    pause = false;
}

//---------------- animation option
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;
//----------------- frame function
function animate( time ){
    if( lastTime == null )
        lastTime = time;
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
        if( !pause ){
            preRender.fillStyle = "#ECF0F1";
            preRender.fillRect(0,0, canvas.width,canvas.height);
            player.animate( keys, time );
            for( let i = 0; i < enemies.length; i++ ){
                if( enemies[ i ].isCollision( player ) )
                    restart( init, Math.floor( score ));
                
                enemies[i].animate();   
            }
            c.drawImage( preCanvas, 0, 0 );
            score += (time - lastTime)/100;
        } 
        lastTime = time; 
    }
    // next frame
    frameId = requestAnimationFrame(animate);
}

//------------------ events
$( window ).resize(resize);
//------------------ keyboadr events
$(document).keydown( e => {
    keys[ e.which ] = true;
});
$(document).keyup( e => {
    keys[ e.which ] = false;
});

//------------------- clear function
clear = function(){
    $( window ).off( "resize" );
    $( document ).off( "keydown" );
    $( document ).off( "keyup" );
    enemies = null;
    player = null;
    window.cancelAnimationFrame( frameId );
    $( canvas ).remove();
    destroyOptions();
};

//------------------ boot
createOptions();
init();
frameId = requestAnimationFrame(animate);
}
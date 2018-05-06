// Gravity Game
game = function (){

//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//---------------- frame id
let frameId;

//---------------- offsreen render
let preCanvas = document.createElement("canvas");
let preRender = preCanvas.getContext("2d");

//--------------- game Options
let fps = 60;
let starsNumber = 80;

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
            <input id="gravityFps" type="number" class="validate valid" value="${fps}">
            <label for="gravityFps" class="trans active" data-trans="gravityFps"></label>
        </div> 
    </div>
    <div class="row">
        <div class="input-field col s12">
            <i class="material-icons prefix">slow_motion_video</i>
            <input id="starsNumber" type="number" class="validate valid" value="${starsNumber}">
            <label for="starsNumber" class="trans active" data-trans="starsNumber"></label>
        </div> 
    </div>
    <div class="row center-align valign-wrapper">
        <div class="col s12">
            <a class="waves-effect waves-light btn btn-small restart-game-trigger center-block"><i class="material-icons right">replay</i><span class="trans" data-trans="gameRestart"></span></a>
        </div>
    </div>
    `);
    $('#starsNumber').on('change', ()=>{
        if( $( '#starsNumber' ).val() > 0  ){
            starsNumber = Number($( '#starsNumber' ).val());
        }   
    });
    $('#gravityFps').on('change', ()=>{
        if( $( '#gravityFps' ).val() > 0  ){
            fps = Number($( '#gravityFps' ).val());
            interval = 1000/fps;
        }   
    });
    $(".restart-game-trigger").on('click', ()=>{
        stars = null;
        restart(init,0,"restart");
        
        optionsInstance.close();
    });
}

function destroyOptions(){
    $( optWrapper ).empty();
}


let Star = function(){
    this.init();
}

Star.prototype.init = function(){
    this.x = help.randInt(0, canvas.width);
    this.y = -20;
    this.radius = help.randInt(10,25);
    this.vx = help.randInt(-6,6);
    this.vy = help.randInt(1, 6);
};

Star.prototype.draw = function(){
    preRender.beginPath();
    preRender.arc( this.x, this.y, this.radius, 0, Math.PI*2);
    preRender.fillStyle = '#E74C3C';
    preRender.fill();
    preRender.closePath();
};

Star.prototype.animate = function (time){
    this.draw();
    this.x += this.vx;
    this.y += this.vy;
    
    if( this.y > canvas.height + 50 || this.x < -50 || this.x > canvas.width + 50 ) // loop stars
        this.init();
}


//---------------- change size
function resize(){
    canvas.height = $(gameContainer).innerHeight();
    canvas.width = $(gameContainer).innerWidth();   

    preCanvas.height = canvas.height;
    preCanvas.width = canvas.width;

}

let stars = [];
//----------------- init function
function init(){
    resize(); 
    stars = [];
    for( let i = 0; i < starsNumber; i++ ) // creat a lot of stars
        stars.push( new Star() );

    frameId = requestAnimationFrame(animate);
    pause = false;
}

//---------------- animation option
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;
//----------------- frame function
function animate( time ){
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        then = now - (delta % interval);
        if( !pause ){

            preRender.fillStyle = "#332532";
            preRender.fillRect(0,0, canvas.width,canvas.height);
            //------------------- animate stars 
            for( let i in stars )
                stars[ i ].animate( time );

            c.drawImage( preCanvas, 0, 0 );
        } 
    }
    // next fram
    frameId = requestAnimationFrame(animate);
}

//------------------ events
$( window ).resize(resize);

//------------------- clear function
clear = function(){
    $( window ).off( "resize" );
    stars = null;
    window.cancelAnimationFrame( frameId );
    $( canvas ).remove();
    destroyOptions();
};
//------------------ boot
createOptions();
init();
}
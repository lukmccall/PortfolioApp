// Sort Game
game = function(){
//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//------------------ frame id
let framId;

let elementNumber;
let elementHeightDiff; 
let startX;

//------------------ game options
let fps = 60;
let elementWidth = 10;

//--------------- game Options dom elements
const opt = $('#options .options-content');
let optWrapper;

function createOptions(){
    // optWrapper = $("<div class='row'></div>"); // create wrapper 
    // $(opt).append( optWrapper );
    // $(optWrapper).append( ` 
    // <div class="row">
    //     <div class="input-field col s12">
    //         <i class="material-icons prefix">slow_motion_video</i>
    //         <input id="mazeFps" type="number" class="validate valid" value="${fps}">
    //         <label for="mazeFps" class="trans active" data-trans="mazeFps"></label>
    //     </div> 
    // </div>
    // <div class="row">
    //     <div class="input-field col s12">
    //         <i class="material-icons prefix">photo_size_select_small</i>
    //         <input id="mazeCellSize" type="number" class="validate valid" value="${cellSizeOpt}">
    //         <label for="mazeCellSize" class="trans active" data-trans="mazeCellSize"></label>
    //     </div> 
    // </div>
    // <div class="row">
    //     <div class="input-field col s12">
    //         <i class="material-icons prefix">fast_forward</i>
    //         <input id="mazeAnimationSteps" type="number" class="validate valid" value="${mazeGeneratorSteps}">
    //         <label for="mazeAnimationSteps" class="trans active" data-trans="mazeAnimationSteps"></label>
    //     </div> 
    // </div>
    // <div class="row center-align valign-wrapper">
    //     <div class="col s12">
    //         <a class="waves-effect waves-light btn btn-small restart-game-trigger center-block"><i class="material-icons right">replay</i><span class="trans" data-trans="gameRestart"></span></a>
    //     </div>
    // </div>
    // `);
    // $('#mazeFps').on('change', ()=>{
    //     if( $( '#mazeFps' ).val() > 0  ){
    //         fps = Number($( '#mazeFps' ).val());
    //         interval = 1000/fps;
    //     }   
    // });
    // $('#mazeCellSize').on('change', ()=>{
    //     if( $( '#mazeCellSize' ).val() >= 3  ){
    //         cellSizeOpt = Number($( '#mazeCellSize' ).val());
    //     }
    // });
    // $('#mazeAnimationSteps').on('change', ()=>{
    //     if( $( '#mazeAnimationSteps' ).val() > 0  )
    //         mazeGeneratorSteps = Number($( '#mazeAnimationSteps' ).val());
    // });
    // $(".restart-game-trigger").on('click', ()=>{
    //     grids = null;
    //     tracker = null;
    //     restart(resize,0,"restart");
        
    //     optionsInstance.close();
    // });
}

function destroyOptions(){
    // $( optWrapper ).empty();
}

//---------------- offsreen render
let preCanvas = document.createElement("canvas");
let preRender = preCanvas.getContext("2d");

//---------------- element class
let Element = function( h, p ){
    this.height = h;
    this.pos = p;

}

Element.prototype.color = "#EFE7BE";
Element.prototype.borderColor = "#013440";
Element.prototype.draw = function(){
    preRender.beginPath();
    preRender.fillStyle = this.color;
    preRender.rect(this.pos, this.height , elementWidth, preCanvas.height );
    preRender.fill();
    preRender.strokeStyle = this.borderColor;
    preRender.stroke();
}

//---------------- change size
function resize(){
    canvas.height = $(gameContainer).innerHeight();
    canvas.width = $(gameContainer).innerWidth();  
    c.fillStyle = "#002635";
    c.fillRect(0,0,canvas.width,canvas.height);
    init();
}

let elements = []; 
function init(){
    // calc elements number
    elementNumber = Math.floor( canvas.width / elementWidth );
    elementHeightDiff = canvas.height / elementNumber;

    //------------------------ render screen size
    preCanvas.height = canvas.height;
    preCanvas.width = elementNumber * elementWidth;
    
    //------------------------ grid position
    startX = ( canvas.width - preCanvas.width ) / 2;

    for( let i = 0; i < elementNumber; i++ )
        elements.push( new Element( i * elementHeightDiff, i * elementWidth ) );
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
            for( let i in elements )
                elements[ i ].draw();

            c.drawImage( preCanvas, startX, 0 );
        }    
    }

    // next frame
    frameId = requestAnimationFrame(animate);
}

//------------------ events
$( window ).resize(resize);

//------------------- clear function
clear = function(){
    $( window ).off( "resize" );
    window.cancelAnimationFrame( frameId );
    $( canvas ).remove();
    $( preCanvas ).remove();
    destroyOptions();
};


//--------------- boot
resize();
frameId = requestAnimationFrame(animate);
}
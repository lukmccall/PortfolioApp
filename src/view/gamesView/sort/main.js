// Sort Game
game = function(){
//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//---------------- frame id
let frameId;

//------------------ setup var
let elementNumber;
let elementHeightDiff; 
let startX;
let notSolved;
let alg;
let step;

//------------------ game options
let elementWidth = 10;
let sortMethod = "insert"; // select, insert
let randomMethod = "shuffle";
let fps = 10;
let order = 0; // 0 - ascending, 1 - deascending;

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
Element.prototype.changeColor = "#AB1A25";
Element.prototype.draw = function( i, type = 0 ){
    i *= elementWidth;

    // clear prev element
    preRender.fillStyle = "#002635";
    preRender.fillRect(i,0,elementWidth,preCanvas.height);

    // draw this element
    preRender.beginPath();
    if( type === 0 )
        preRender.fillStyle = this.color;
    else 
        preRender.fillStyle = this.changeColor;
    preRender.rect( i , this.height , elementWidth, preCanvas.height );
    preRender.fill();
    preRender.strokeStyle = this.borderColor;
    preRender.stroke();
}

//---------------- order check function
function isOrder( element1, element2 ){
    return ( element1.height <= element2.height && order == 0 ) || ( element1.height >= element2.height && order == 1 ); 
}

//---------------- random functions
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

//----------------- sort functions
function insertionSort( step ){
    if( step >= elementNumber ){ // end of alg
        notSolved = false;
        return;
    }

    let key, j;
    key = elements[ step ];
    j = step - 1;
    actives.push( step );
    while ( j >= 0 && isOrder( elements[ j ], key ) ){
        prevs.push( j + 1 );
        elements[ j + 1 ] = elements[ j ];
        j = j-1;
    }
    elements[ j + 1 ] = key;
    actives.push( j + 1 );
}

function selectionSort( step ){
    if( step >= elementNumber ){ // end of alg
        notSolved = false;
        return;
    }
    // Find the minimum element in unsorted array
    let minId = step;

    for (let j = step; j < elementNumber; j++)
        if ( !isOrder(elements[j], elements[ minId ]) )
            minId = j;

    [elements[ step ], elements[ minId ]] = [ elements[ minId ], elements[ step ]];
    actives.push( step );
    actives.push( minId );
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
let actives = [];
let prevs = [];
let stack = [];
function init(){
    step = 0;
    elements = [];
    actives = [];
    prevs = [];
    stack = [];

    // calc elements number
    elementNumber = Math.floor( canvas.width / elementWidth );
    elementHeightDiff = canvas.height / elementNumber;

    //------------------------ render screen size
    preCanvas.height = canvas.height;
    preCanvas.width = elementNumber * elementWidth;
    
    //------------------------ grid position
    startX = ( canvas.width - preCanvas.width ) / 2;

    //------------------------ random elements
    switch( randomMethod ){
        case "revers":{
            for( let i = 0; i < elementNumber; i++ )
                elements.push( new Element( i * elementHeightDiff, i * elementWidth ) );
        }
        break;
        case "shuffle":{
            for( let i = 0; i < elementNumber; i++ )
                elements.push( new Element( i * elementHeightDiff, i * elementWidth ) );
            elements = shuffle( elements );
        }
        break;
        default:{

        }
    }

    switch( sortMethod ){
        case "insert":{
            alg = insertionSort;
        }
        break;
        case "select":{
            alg = selectionSort;
        }
        break;   
    }


    notSolved = true;

    for( let i in elements )
        elements[ i ].draw( i );
    frameId = requestAnimationFrame(animate);
}

//----------------- animate options
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
        if( !pause && notSolved){
            let i;
            while( prevs.length > 0 ){
                i = prevs.pop();
                elements[ i ].draw( i );
            }

            alg( step++ ); // one step of alg 

            while( actives.length > 0 ){
                i = actives.pop();
                prevs.push( i );
                elements[ i ].draw( i, 1 );
            }
            
            c.drawImage(preCanvas,0,0);
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
    window.cancelAnimationFrame( frameId );
    $( canvas ).remove();
    $( preCanvas ).remove();
    destroyOptions();

    elements = null;
    actives = null;
    prevs = null;
    stack = null;
};


//--------------- boot
resize();
}
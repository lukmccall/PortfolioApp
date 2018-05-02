game = function(){
//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//------------------ frame id
let framId;

//---------------- offsreen render
let preCanvas = document.createElement("canvas");
let preRender = preCanvas.getContext("2d");

let rows;
let cols;
let startX;
let startY;
const cellSize = 20;
const mazeGeneratorSteps = 1;
let Cell = function( i, j ){
    this.i = i;
    this.j = j;
    this.visited = false;
    this.path = false;
    this.walls = [ true, true, true, true ];
    /*
        walls[0] - top
        walls[1] - right
        walls[2] - bottom
        walls[3] - left
    */
}; 

Cell.prototype.bgColor = "#140814";
Cell.prototype.visitedColor = "#540032";
Cell.prototype.wallColor = "#C9283E";
Cell.prototype.curColor = "#ED8F5B";
Cell.prototype.pathColor = "#770032";

//-------------------------- creat line 
Cell.prototype.line = function(x1,y1,x2,y2){
    preRender.beginPath();
    preRender.moveTo(x1,y1);
    preRender.lineTo(x2,y2);
    preRender.stroke();
    preRender.closePath();
}

Cell.prototype.draw = function(){
    let x = this.i * cellSize;
    let y = this.j * cellSize;
    
    // ------------------------ marks visited
    if( this.visited ){
        if( this === cur ) // mark cur
            preRender.fillStyle = this.curColor;
        else if( this.path )
            preRender.fillStyle = this.pathColor;
        else
            preRender.fillStyle = this.visitedColor;
        preRender.fillRect( x, y, cellSize, cellSize );
    } else { // not visited call
        preRender.fillStyle = this.bgColor;
        preRender.fillRect( x, y, cellSize, cellSize );
    }

    preRender.strokeStyle = this.wallColor;

    if( this.walls[ 0 ] ) // top
        this.line( x, y, x + cellSize, y);
    if( this.walls[ 1 ] ) // right
        this.line( x + cellSize, y, x + cellSize, y + cellSize );
    if( this.walls[ 2 ] ) //bottom
        this.line( x, y + cellSize, x + cellSize, y + cellSize );
    if( this.walls[ 3 ] ) //left
        this.line( x, y, x, y +cellSize );

    
}

Cell.prototype.connect = function( nextCell ){
    let x = this.i - nextCell.i;
    
    if( x == 1 )
        this.walls[ 3 ] = nextCell.walls[ 1 ] = false;
    else if( x == -1 )
        this.walls[ 1 ] = nextCell.walls[ 3 ] = false;
    
    let y = this.j - nextCell.j;

    if( y == 1)
        this.walls[ 0 ] = nextCell.walls[ 2 ] = false;
    else if( y == -1 )
        this.walls[ 2 ] = nextCell.walls[ 0 ] = false;
    
    
}

function getIndex( i, j ){
    if( i < 0 || j < 0 || i > cols - 1 || j > rows - 1 )
        return -1;
    return i+j*cols;
}
//------------ maze generator
function getNeighbors( i, j ){
    // get Neighbors
    let right = grids[ getIndex( i, j + 1 ) ];
    let left = grids[ getIndex( i, j - 1 ) ];
    let top = grids[ getIndex( i - 1, j) ];
    let bottom = grids[ getIndex( i + 1, j ) ];

    let neighbors = [];

    if( right && !right.visited )
        neighbors.push( right );
    if( left && !left.visited )
        neighbors.push( left );
    if( top && !top.visited )
        neighbors.push( top );
    if( bottom && !bottom.visited )
        neighbors.push( bottom );

    if( neighbors.length == 0 )
        return null;
    
    let rI = help.randInt( 0, neighbors.length - 1 );
    return neighbors[ rI ];    
} 

function mazeGenerator(){
    let next = getNeighbors( cur.i, cur.j );
    if( next ){ // cur has good neighbors
        next.visited = true;
        next.path = true;
        cur.connect( next );
        tracker.push( cur );
        cur = next;
    } else if( tracker.length > 0 ){
        cur.path = false;
        cur = tracker.pop();
        cur.path = false;
    }
    
}

//---------------- change size
function resize(){
    canvas.height = $(gameContainer).innerHeight();
    canvas.width = $(gameContainer).innerWidth();   
    c.fillStyle = "#324D5C";
    c.fillRect(0,0,canvas.width,canvas.height);
    init();
}

let grids = [];
let cur;
let tracker = [];
//----------------- init function
function init(){
    grids = [];
    tracker = [];
    //------------------------ calc rows,cols number
    rows = Math.floor( canvas.height / cellSize );
    cols = Math.floor( canvas.width / cellSize );
    
    //------------------------ render screen size
    preCanvas.width = cols * cellSize;
    preCanvas.height = rows * cellSize;

    //------------------------ grid position
    startX = ( canvas.width - preCanvas.width ) / 2;
    startY = ( canvas.height - preCanvas.height ) / 2;

    //------------------------ creat cells
    for( let i = 0; i < rows; i++ )
        for( let j = 0; j < cols; j++ )
            grids.push( new Cell( j, i ));
    
    //------------------------- start point
    //cur = grids[ 0 ];
    cur = grids[ help.randInt(0,grids.length-1)];
    cur.visited = true;
    cur.path = true;
    pause = false;
}

//---------------- animation option
let fps = 60;
let now;
let then = Date.now();
let interval = 1000/fps;
let delta;
//----------------- frame function
function animate( time ){
    frameId = requestAnimationFrame(animate);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
        if( !pause ){
            preRender.fillStyle = "#324D5C";
            preRender.fillRect(0,0, preCanvas.width,preCanvas.height);
            for( let i in grids )
                grids[ i ].draw();
            for( let i = 0; i < mazeGeneratorSteps; i++ )
                mazeGenerator();
            c.drawImage( preCanvas, startX, startY );
        }    
    }
}

//------------------ events
$( window ).resize(resize);

//------------------- clear function
clear = function(){
    $( window ).off( "resize" );
    window.cancelAnimationFrame( frameId );
    $( canvas ).remove();
    grids = null;
    tracker = null;
};

//------------------ boot
resize();
frameId = requestAnimationFrame(animate);

}
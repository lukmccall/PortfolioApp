//---- creat game function ----/
game = function (){

//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

let preCanvas = document.createElement("canvas");
let preRender = preCanvas.getContext("2d"); // pre render

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
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
    
    for( let i = 0; i < 80; i++ ) // creat a lot of stars
        stars.push( new Star() );
}

//----------------- frame function
function animate( time ){
    if( !pause ){
        preRender.fillStyle = "#332532";
        preRender.fillRect(0,0, canvas.width,canvas.height);
        //------------------- animate stars 
        for( let i in stars )
            stars[ i ].animate( time );

        c.drawImage( preCanvas, 0, 0 );
    } 
    requestAnimationFrame(animate);
}

//------------------ events
$( window ).resize(resize);

//------------------ boot
init();
requestAnimationFrame(animate);
}
//---- creat game function ----/
game = function (){

//---------------- dom elements
const canvas = document.createElement("canvas");
const c = canvas.getContext("2d");
const gameContainer = document.getElementById("main");
gameContainer.appendChild(canvas);

//---------------- change size
function resize(){
    canvas.height = $(gameContainer).innerHeight();
    canvas.width = $(gameContainer).innerWidth();   
}

//----------------- init function
function init(){
    resize();  
    

}

//----------------- frame function
function animate( time ){
    c.fillStyle = "#332532";
    c.fillRect(0,0, canvas.width,canvas.height);
    
    requestAnimationFrame(animate);
}

//------------------ events
$( window ).resize(resize);

//------------------ boot
init();
requestAnimationFrame(animate);

}
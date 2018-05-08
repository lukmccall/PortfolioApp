const { remote } = require('electron');
const main = remote.require("./main.js"); // get  main proccess
const { ipcRenderer } = require('electron');
const fs = require('fs');
const help = remote.require('./src/modules/helpersModule/helpersModule');

//------------------------- game controller componets 
let site = 'sort'; // actual frame name 
let game;   // game scope
let pause = false;  //  is pause?
let optionsInstance; // options modal instance
let restart = function( startFunction, score, type = "gameover" ){ // type = gameover | restart
    pause = true;
    if( type == "gameover" ){
        $(".restart-trigger").off("click");
        $("#restart").removeClass("hidden");
        $("#restart-info").html( lang.trans( "gameOver", remote.getGlobal('lang'))+"<br>" + lang.trans("yourScore", remote.getGlobal("lang"))  + ": " + score );
        $('.restart-trigger').on('click', ()=>{
            startFunction();
            $("#restart").addClass("hidden");
        });
    }
    else if( type == "restart" ){
        startFunction();
        pause = true;
    }
}; // restart game 
let clear; // clear function

//--------------- template render function ----------------/ 
const lang = remote.require("./src/modules/langModule/langModule");
let trans = ()=>{
    $('.trans').each(function( key, x ){
        $(x).text( lang.trans($(x).data("trans"), remote.getGlobal('lang')) );
    });
}
let render = ()=>{
    if( typeof clear === "function" )
        clear();

    $(".restart-trigger").off("click");
    $("#restart").addClass("hidden");   
    
    $('#main').html( "<script>"+fs.readFileSync("src/view/gamesView/"+site+"/main.js", 'utf8') +"</script>" ); 
    
    
    if( typeof game === "function" )
        game();
    pause = true;
    trans();
    pause = false;
};


//---------------- loader function------------------------/
function loaderOn(){
   return $('.loader').removeClass("hidden").delay( 800 );
}
function loaderOff(){
    $('.loader').addClass("hidden");
}


$(document).ready(function(){
    // init sidenav
    let sideOption = {
        onOpenStart: function(){
            pause = true;
        },
        onCloseEnd: function(){
            pause = false;
        }
    };
    let elem = document.querySelector('.sidenav');
    let sideNavInstance = M.Sidenav.init(elem, sideOption);


    //init optionModal
    let optionsOption = {
        onOpenStart: function(){
            pause = true;
        },
        onCloseEnd: function(){
            pause = false;
        }
    };
    elem = document.getElementById('options');
    optionsInstance = M.Modal.init( elem, optionsOption );
     //------------------------------ change lang modal
    $('.lang-trigger').on('click', ()=>{
        let langModal = new remote.BrowserWindow({
            width: 400, 
            height: 260,
            parent: remote.getCurrentWindow(),
            modal: true,
            frame: false,
            show: false
        });  
        
        langModal.setResizable( false ); // protect modal   
        langModal.loadURL( main.getView('langView') );
        
        langModal.once('ready-to-show', () => {
            pause = true;
            langModal.show();
        });        
    });
    
    //------------------------------ change game
    $('.game-trigger').on('click',  e => {
        sideNavInstance.close();
        $.when( loaderOn() ).then( function(){
            game = null;
            site = $(e.target).data('game');
            render();
            loaderOff();
        });
    });

    //----------------------------- close window
    $('.close-trigger').on('click', ()=>{
        if( typeof clear === "function" ) // clear before close
            clear();
        remote.getCurrentWindow().close();
    });
    render(); // render game view
    loaderOff();
});

//------------------------ events
ipcRenderer.on("lang-change", ( e, lang ) => {
    trans();
});

ipcRenderer.on("unpause", (e,p)=>{
    pause = !p;
});
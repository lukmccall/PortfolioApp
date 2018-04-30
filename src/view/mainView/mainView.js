const { remote } = require('electron');
const main = remote.require("./main.js"); // get  main proccess
const { ipcRenderer } = require('electron');
const fs = require('fs');
const help = remote.require('./src/modules/helpersModule/helpersModule');

let site = 'gravity'; // actual frame name 
let game;   // game scope
let pause = false;  //  is pause?

//--------------- template render function ----------------/ 
const lang = remote.require("./src/modules/langModule/langModule");
let render = ()=>{
    $('#main').html( "<script>"+fs.readFileSync("src/view/gamesView/"+site+"/main.js", 'utf8') +"</script>" ); 
    
    $('.trans').each(function( key, x ){
        $(x).text( lang.trans($(x).data("trans"), remote.getGlobal('lang')) );
    });

    if( typeof game === "function" )
        game();
};

//---------------- loader function------------------------/
function loaderOn(){
   return $('.loader').removeClass("hidden").delay( 500 );
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
    }
    let elem = document.querySelector('.sidenav');
    let sideNavInstance = M.Sidenav.init(elem, sideOption);

    //------------------------------ change lang modal
    $('.lang-trigger').on('click', function(){
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
            langModal.show();
        });        
    });
    
    //------------------------------ change game
    $('.game-trigger').on('click', function( e ){
    
        sideNavInstance.close();
        $.when( loaderOn() ).then( function(){
            game = null;
            site = $(e.target).data('game');
            render();
            loaderOff();
        });
    });
    render(); // render game view
    loaderOff();
});

ipcRenderer.on("lang-change", ( e, lang ) => {
    render();
});
const { remote } = require('electron');
const main = remote.require("./main.js"); // get  main proccess
const { ipcRenderer } = require('electron');
const fs = require('fs');

let site = 'gravity'; // actual frame name 
let game;
//--------------- template render function ----------------/ 
const lang = remote.require("./src/modules/langModule/langModule");
let render = ( )=>{
    $('#main').html( "<script>"+fs.readFileSync("src/view/gamesView/"+site+"/main.js", 'utf8') +"</script>" ); 
    
    $('.trans').each(function( key, x ){
        $(x).text( lang.trans($(x).data("trans"), remote.getGlobal('lang')) );
    });

    game();
};


$(document).ready(function(){
    $('.sidenav').sidenav(); // sidenav init

    //----------------------------------------- change lang modal
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

    render();
   // $('.lang-trigger').click();
});

ipcRenderer.on("lang-change", ( e, lang ) => {
    render();
});
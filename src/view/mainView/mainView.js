const { remote } = require('electron');
const main = remote.require("./main.js"); // get  main proccess
const { ipcRenderer } = require('electron');

//--------------- template render function ----------------/ 
const lang = remote.require("./src/modules/langModule/langModule");
let render = ( )=>{
    $('.trans').each(function( key, x ){
        $(x).text( lang.trans($(x).data("trans"), remote.getGlobal('lang')) );
    });
};

$(document).ready(function(){
    render();
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

   // $('.lang-trigger').click();
});

ipcRenderer.on("lang-change", ( e, lang ) => {
    render();
});
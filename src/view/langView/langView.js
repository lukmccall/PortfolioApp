const { remote } = require('electron');
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
    let langView = remote.getCurrentWindow();
    //-------------------- close widnow -----------/
    $('.close-trigger').on('click',function(){
        // ipcRenderer.send('unpause', true);
        langView.close();
    });

    //--------------------- change lang ------------/
    let langBtn = document.querySelectorAll(".pl, .en");
    for (let i = 0; i < langBtn.length; i++) {
        langBtn[i].addEventListener("click", function() {
            ipcRenderer.send("lang-change", langBtn[i].getAttribute('data-lang'));
            langView.close();
        });
    }

    // window close event
    window.addEventListener('beforeunload', ()=>{
        ipcRenderer.send('unpause', true); 
    });
   
});

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
    //-------------------- close widnow -----------/
    $('.close-trigger').on('click',function(){
        let langView = remote.getCurrentWindow();
        langView.close();
    });

    //--------------------- change lang ------------/
    let langBtn = document.querySelectorAll(".pl, .en");
    for (let i = 0; i < langBtn.length; i++) {
        langBtn[i].addEventListener("click", function() {
            ipcRenderer.send("lang-change", langBtn[i].getAttribute('data-lang'));
            let langView = remote.getCurrentWindow();
            langView.close();
        });
    }
});

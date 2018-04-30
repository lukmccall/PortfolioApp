const { remote } = require('electron');
const lang = require(process.env.root+"/src/modules/langModule/langModule");
const main = remote.require("./main.js"); // get  main proccess


$(document).ready(function(){
    $('.sidenav').sidenav(); // sidenav init

    //----------------------------------------- change lang modal
    $('.lang-trigger').on('click', function(){
        let langModal = new remote.BrowserWindow({
            width: 400, 
            height: 260,
            parent: remote.getCurrentWindow(),
            modal: true,
            frame: false
        });  

        langModal.loadURL( main.getView('langView') );
    });

    $('.lang-trigger').click();
});
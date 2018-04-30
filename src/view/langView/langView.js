const { remote } = require('electron');

$(document).ready(function(){    
    //-------------------- close widnow -----------/
    $('.close-trigger').on('click',function(){
        let langView = remote.getCurrentWindow();
        langView.close();
    });
});
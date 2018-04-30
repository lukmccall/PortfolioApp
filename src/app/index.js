const lang = require(process.env.root+"/src/modules/langModule/langModule");

console.log(lang.trans("help"));


$(document).ready(function(){
    $('.sidenav').sidenav(); // sidenav init

    //----------------------------------------- change lang modal
    $('.lang-trigger').on('click', function(){
        console.log("lang");    
    });
});
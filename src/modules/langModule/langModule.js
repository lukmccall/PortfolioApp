const remote = require("electron").remote;

//----------------------------------- imports lang file
const trans = {
    pl: require(__dirname+"/trans/pl-Pl/main.js"),
    en: require(__dirname+"/trans/en-En/main.js")
};

let lang = remote.getGlobal("lang"); // todo: make onLangChange

module.exports = {
    trans: function( word ){ // translate word to current lang 
        if( trans[ lang ][ word ] ) 
            return trans[lang][word]; 
        return word;
    }
};

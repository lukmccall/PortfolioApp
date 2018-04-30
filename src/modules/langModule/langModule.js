//----------------------------------- imports lang file
const trans = {
    pl: require(__dirname+"/trans/pl-Pl/main.js"),
    en: require(__dirname+"/trans/en-En/main.js")
};

module.exports = {
    trans: function( word, lang ){ // translate word to current lang 
        if( trans[ lang ][ word ] ) 
            return trans[lang][word]; 
        return word;
    }
};

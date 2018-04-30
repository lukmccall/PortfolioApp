module.exports = {
    rand: function( min, max ){
        return Math.random()*(max-min+1)+min;
    },
    randInt: function( min, max ){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}
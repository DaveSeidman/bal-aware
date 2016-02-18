var Banking = require('banking');

var parseString = require('xml2js').parseString;

var checking = Banking({

});

var credit = Banking({
    
});


var today = new Date();
var todayFormatted =
today.getFullYear() + '' +
(((today.getMonth() + 1) < 10) ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + '' +
((today.getDate() < 10) ? ('0' + today.getDate()) : today.getDate() );


checking.getStatement({start:todayFormatted, end:todayFormatted}, function(err, res) {
    if(err) {
        console.log(err)
    }
    else {
        var str = JSON.stringify(res),
        end = str.substring(str.lastIndexOf("BALAMT"), str.length),
        open = end.indexOf('[') + 2,
        close = end.indexOf(']') - 2,
        bal = end.substring(open, close);
        console.log("checking:", bal);
    }
});

credit.getStatement({start:todayFormatted, end:todayFormatted}, function(err, res) {
    if(err) {
        console.log(err)
    }
    else {
        var str = JSON.stringify(res),
        end = str.substring(str.indexOf("BALAMT"), str.length),
        open = end.indexOf('>') + 1,
        close = end.indexOf('<'),
        bal = end.substring(open, close);
        console.log("credit", bal);
    }
});

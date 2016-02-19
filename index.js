var Banking = require('banking');
var accounts = require('./private/accounts.json');
var parseString = require('xml2js').parseString;

var today = new Date();
var todayFormatted =
today.getFullYear() + '' +
(((today.getMonth() + 1) < 10) ? ('0' + (today.getMonth() + 1)) : (today.getMonth() + 1)) + '' +
((today.getDate() < 10) ? ('0' + today.getDate()) : today.getDate() );


for(var i = 0; i < accounts.data.length; i++) {
    var account = accounts.data[i];
    var bankAccount = Banking(account);
    bankAccount.getStatement({start:todayFormatted, end:todayFormatted}, function(err, res) {

        if(err) {
            console.log("there was a banking error", err);
        }
        else {
            parseString(res.xml, function (err, result) {

                var ofx = result.OFX;
                var bal = getObjects(ofx, 'LEDGERBAL');
                console.log(bal[0].LEDGERBAL[0].BALAMT[0]);
            })
        }
    });
}


function getObjects(obj, key) {
    var objects = [];
    for (var i in obj) {
        if(i == key) objects.push(obj);
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key));
        }
    }
    return objects;
}

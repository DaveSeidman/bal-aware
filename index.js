var Banking = require('banking');
var accounts = require('./private/accounts.json');
var parseString = require('xml2js').parseString;


var dateOffset = 0;


getBalanceForAccount(0);


function getBalanceForAccount(i) {

    if(i < accounts.data.length) {
        var account = Banking(accounts.data[i]);
        var today = new Date();
        getBalanceForDate(account, today, function(data) {
            console.log("done:", data);
            i++;
            getBalanceForAccount(i);
        });
    }
}



function getBalanceForDate(account, date, callback) {

    var dateFormatted = formatDate(date);

    account.getStatement({start:dateFormatted, end:dateFormatted}, function(err, res) {

        if(err) {
            console.log("there was a banking error", err);
            return callback();
        }
        else {
            parseString(res.xml, function (err, result) {

                var ofx = result.OFX;
                var bal = getObjects(ofx, 'LEDGERBAL');
                if(bal.length) return callback(bal[0].LEDGERBAL[0].BALAMT[0]);
                else return callback("error");
            });

            /*var date = new Date();
            dateOffset++;
            date.setDate(today.getDate() - dateOffset);
            if(date.getDay() > 0) getBalanceForDate(date);*/

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

function formatDate(date) {

    return date.getFullYear() + '' +
    (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '' +
    ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate() );
}

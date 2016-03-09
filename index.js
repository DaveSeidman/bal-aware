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


    //console.log(date.getDay());

    //var dateFormatted = formatDate(date);
    var monday = new Date();
    monday.setDate(date.getDate() - date.getDay() + 1);

    account.getStatement({start:formatDate(monday), end:formatDate(date)}, function(err, res) {

        //console.log(res);
        parseString(res.xml, function (err, result) {

            var ofx = result.OFX;

            searchJSON(ofx, 'BANKTRANLIST2');

            function searchJSON(obj, search) {
                for (var k in obj) {
                    if (typeof obj[k] == "object" && obj[k] !== null) {
                        if(k == search) {
                            //return (obj[k]);
                            console.log(obj[k]);
                            break;
                        }
                        else searchJSON(obj[k], search);
                    }
                }
            }
            //var transactions = getValues(ofx, 'BANKTRANLIST');
            //console.log(Object.keys(ofx));
            // for(var key in transactions) {
            //     console.log(transactions[key]);
            // }
        });
        //return callback("test");

    });
    /*account.getStatement({start:dateFormatted, end:dateFormatted}, function(err, res) {

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

            // var date = new Date();
            // dateOffset++;
            // date.setDate(today.getDate() - dateOffset);
            // if(date.getDay() > 0) getBalanceForDate(date);

        }
    });*/
}

function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

/*function getObjects(obj, key) {
    var objects = [];
    for (var i in obj) {
        if(i == key) objects.push(obj);
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key));
        }
    }
    return objects;
}*/

function formatDate(date) {

    return date.getFullYear() + '' +
    (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '' +
    ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate() );
}

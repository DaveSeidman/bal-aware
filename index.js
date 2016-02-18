var Banking = require('banking');

var parseString = require('xml2js').parseString;

var checking = Banking({
    fid: 5959
    , fidOrg: 'HAN'
    , url: 'https://eftx.bankofamerica.com/eftxweb/access.ofx'
    , bankId: '021000322' /* If bank account use your bank routing number otherwise set to null */
    , user: 'daveseidman'
    , password: 'baFingernail1'
    , accId: '483005421227' /* Account Number */
    , accType: 'CHECKING' /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
    , ofxVer: 103 /* default 102 */
    , app: 'QWIN' /* default  'QWIN' */
    , appVer: '1700' /* default 1700 */
});

var credit = Banking({
    fid: 5959
    , fidOrg: 'HAN'
    , url: 'https://eftx.bankofamerica.com/eftxweb/access.ofx'
    , bankId: '021000322' /* If bank account use your bank routing number otherwise set to null */
    , user: 'daveseidman'
    , password: 'baFingernail1'
    , accId: '4400664846144377' /* Account Number */
    , accType: 'CREDITCARD' /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
    , ofxVer: 103 /* default 102 */
    , app: 'QWIN' /* default  'QWIN' */
    , appVer: '1700' /* default 1700 */
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

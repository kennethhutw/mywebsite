
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/dE5PQ0mGcup3j5LO0nTj"));
$("#generateWalletByPSW").click(function(){
    var psw = $("#psw").val();
    var reapetPSW = $("#repeatpsw").val();
    var seed = "add high zero approve hood abstract math all lawsuit limit aim";
    var address = "0xf5735f12d0174082219e886e4f4e143305824c14";
    var privatekey = "0x0c53918f40c08b8c0d33557f138d38340ca10f03";
    var link = document.getElementById('downloadlink');
    var walletsercet = "Random Seed : " + seed + "  \r\n Address : " + address + " \r\n Private Key :  " + privatekey ;
    var data = new Blob([walletsercet], { type: 'text/plain' });
    var textFile = "text.txt";
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

   var link = window.URL.createObjectURL(data);

    $("#walletseed").html("Random Seed : '" + seed + " ' <br> Address : '" + address + "' <br> Private Key : ' " + privatekey + "'  <a download='WalletSeed.txt' target='_blank' href='" + link+"'>Link</a>");
    $("#walletseed").slideDown("slow");

    return;
    if (!psw || psw == "")
   {   
       alert("Password cannnot be empty");
        return;
   }
    if (psw != reapetPSW)
    {
        alert("Password and reapte Password are not same");
        return;
    }
    var secretSeed = lightwallet.keystore.generateRandomSeed();

    // the seed is stored encrypted by a user-defined password
  
    lightwallet.keystore.createVault({
        password: psw,
        seedPhrase: secretSeed,
        hdPathString: "m/0'/0'/0'"
     }, function (err, ks) {
        console.log("secretSeed : " + secretSeed);
        console.log("ks : " + JSON.stringify(ks));
        ks.keyFromPassword(psw, function (err, pwDerivedKey) {
            if (err) throw err;

            // generate five new address/private key pairs
            // the corresponding private keys are also encrypted
            console.log("pwDerivedKey : " + pwDerivedKey);
            ks.generateNewAddress(pwDerivedKey, 1);
            var addr = ks.getAddresses();
            console.log("addr : " + addr);
            ks.passwordProvider = function (callback) {
                var pw = prompt("Please enter password", "Password");
                callback(null, pw);
            };

            // Now set ks as transaction_signer in the hooked web3 provider
            // and you can start using web3 using the keys/addresses in ks!
        });
        // Now set ks as transaction_signer in the hooked web3 provider
        // and you can start using web3 using the keys/addresses in ks!
    });
});
var global_keystore="";
$("#ImportWallet").click(function () {
    var psw = $("#ImportPSW").val();
    var seed = $("#ImportSeed").val();


    lightwallet.keystore.createVault({
        password: psw,
        seedPhrase: seed,
        //random salt 
        hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {

        global_keystore = ks

        $("#ImportSeed").val('');
        console.log("secretSeed : " + seed);
        console.log("ks : " + JSON.stringify(ks));
        // newAddresses(password);
        // setWeb3Provider(global_keystore);

        // getBalances();
        global_keystore.keyFromPassword(psw, function (err, pwDerivedKey) {
            console.log("addr : " + pwDerivedKey);
            global_keystore.generateNewAddress(pwDerivedKey, 1);
            var addresses = global_keystore.getAddresses();
            console.log("addr : " + addresses);
        });
    });

 });

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};
var textFile = 'aaaaa.txt',
makeTextFile = function (text) {
    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
};

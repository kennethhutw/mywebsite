function clean_addresses() {
    document.getElementById("list").innerHTML = "";
}

function generate_seed() {
    $.get("https://murmuring-wildwood-96117.herokuapp.com/generateSeed", function(new_seed) {
        console.log("result : " + new_seed);
        var _seed = JSON.parse(new_seed);
        document.getElementById("seed").value = _seed.data;

        generate_addresses(_seed.data);
    }).fail(function(xhr, status, error) {
        // error handling
        console.log("error : " + error);
    });


}

var totalAddresses = 0;

function generate_addresses(seed) {
    if (seed == undefined) {
        seed = document.getElementById("seed").value;
    }

    if (!lightwallet.keystore.isSeedValid(seed)) {
        document.getElementById("info").innerHTML = "Please enter a valid seed";
        return;
    }

    totalAddresses = prompt("How many addresses do you want to generate");

    if (!Number.isInteger(parseInt(totalAddresses))) {
        document.getElementById("info").innerHTML = "Please enter valid number of addresses";
        return;
    }

    $.get("https://murmuring-wildwood-96117.herokuapp.com/generateKeys", {
        amount: totalAddresses,
        seed: seed
    }, function(addresses) {
        console.log("result : " + addresses);
        var _addresses = JSON.parse(addresses);
        var html = "";
        for (var count = 0; count < _addresses.data.length; count++) {
            var _address = _addresses.data[count];

            html = html + "<li>";
            html = html + "<p><b>Address: </b>" + _address.address + "</p>";
            html = html + "<p><b>Private Key: </b>0x" + _address.private_key + "</p>";
            html = html + "<p><b>Balance: </b>" + _address.balance + " ether</p>";
            html = html + "</li>";
        }

        document.getElementById("list").innerHTML = html;
    }).fail(function(xhr, status, error) {
        // error handling
        console.log("error : " + error);
    });

}
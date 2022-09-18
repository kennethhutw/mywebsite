App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
   
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      web3.version.getNetwork((err, netId) => {
        switch (netId) {
          case "1":
          alert('You use mainnet. This application only work on testnet');
          $(":button").attr('disabled','disabled');
          var alertcode = '<div class="alert alert-danger">' +
                  '<strong>Danger!</strong> You use mainnet. This application only work on testnet.'+
                  ' Please change to testnet and refresh page again.' +
                  '</div>';
                  $("#alertMsg").html(alertcode);
            return;
            break
          case "2":
            console.log('This is the deprecated Morden test network.')
            break
          case "3":
            console.log('This is the ropsten test network.')
            break
          default:
            console.log('This is an unknown network.')
        }
      })
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#account").text("Account : " +account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $("#accountBalance").text("Amount : " + web3.fromWei(balance, "ether") + " ETH");
          }
          else{
            $("#accountBalance").text("Amount : 0 ETH (Error)");
          }
        });
      }
      else{
        $("#account").text("Account : Cannot get account");
        $("#accountBalance").text("Amount : 0 ETH");
      }
    });
  },

  initContract: function() {
    $.getJSON('ChainList.json', function(chainListArtifact) {
      // Get the necessary contract artifact file and use it to instantiate a truffle contract abstraction.
      App.contracts.ChainList = TruffleContract(chainListArtifact);

      // Set the provider for our contract.
      App.contracts.ChainList.setProvider(App.web3Provider);

      // Listen for events
      App.listenToEvents();

      // Retrieve the secret from the smart contract
      return App.reloadSecrets();
    });
  },

  reloadSecrets: function() {
    // avoid reentry
    if (App.loading) {
      return;
    }
    App.loading = true;

    // refresh account information because the balance may have changed
    App.displayAccountInfo();

    var chainListInstance;

    App.contracts.ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.getSecretsForSale();
    }).then(function(secretIds) {
      // Retrieve and clear the secret placeholder
      var secretsRow = $('#secretsRow');
      secretsRow.empty();

      for (var i = 0; i < secretIds.length; i++) {
        var secretId = secretIds[i];
        chainListInstance.secrets(secretId.toNumber()).then(function(secret) {
          App.displaySecret(
            secret[0],
            secret[1],
            secret[3],
            secret[4],
            secret[5],
            secret[6]
          );
        });
      }
      App.loading = false;
    }).catch(function(err) {
      console.log(err.message);
      App.loading = false;
    });
  },

  displaySecret: function(id, seller, name, description, secret, price) {
    // Retrieve the secret placeholder
    var secretsRow = $('#secretsRow');

    var etherPrice = web3.fromWei(price, "ether");

    // Retrieve and fill the secret template
    var secretTemplate = $('#secretTemplate');
    secretTemplate.find('.panel-title').text(name);
    secretTemplate.find('.secret-description').text(description);
    secretTemplate.find('.secret-price').text(etherPrice + " ETH");
    secretTemplate.find('.btn-buy').attr('data-id', id);
    secretTemplate.find('.btn-buy').attr('data-value', etherPrice);

    // seller?
    if (seller == App.account) {
      secretTemplate.find('.secret-seller').text("You");
      secretTemplate.find('.btn-buy').hide();
    } else {
      secretTemplate.find('.secret-seller').text(seller);
      secretTemplate.find('.btn-buy').show();
    }

    // add this new secret
    secretsRow.append(secretTemplate.html());
  },

  sellSecret: function() {
    // retrieve details of the secret
    var _secret_name = $("#secret_name").val();
    var _description = $("#secret_description").val();
    var _price = web3.toWei(parseFloat($("#secret_price").val() || 0), "ether");
    var _description = $("#secret_description").val();
    var _secret = $("#secret_secret").val();

    if ((_secret_name.trim() == '') || (_price == 0)) {
      // nothing to sell
      return false;
    }

    App.contracts.ChainList.deployed().then(function(instance) {
      return instance.sellSecret(_secret_name, _description, _secret, _price, {
        from: App.account,
        gas: 500000
      });
    }).then(function(result) {

    }).catch(function(err) {
      console.error(err);
    });
  },

  // Listen for events raised from the contract
  listenToEvents: function() {
    App.contracts.ChainList.deployed().then(function(instance) {
      instance.sellSecretEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        $("#events").append('<li class="list-group-item">' + event.args._name + ' is for sale' + '</li>');
        App.reloadSecrets();
      });

      instance.buySecretEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        $("#events").append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name + '</li>');
        App.reloadSecrets();
      });
    });
  },

  buySecret: function() {
    event.preventDefault();

    // retrieve the secret price
    var _secretId = $(event.target).data('id');
    var _price = parseFloat($(event.target).data('value'));

    App.contracts.ChainList.deployed().then(function(instance) {
      return instance.buySecret(_secretId, {
        from: App.account,
        value: web3.toWei(_price, "ether"),
        gas: 500000
      });
    }).then(function(result) {

    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

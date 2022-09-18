var candidates = {"Kenneth": "candidate-1", "Ddan": "candidate-2", "Sam": "candidate-3"}
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
      var contractAddress='';
      var networkName='Current Etherum network =>';
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
                        $("#testNet").html(networkName +' Mainnet');
                return;
                break;
            case "2":
              console.log('This is the deprecated Morden test network.');
              break;
            case "3":
            contractAddress = '0xb0e77702b7b9efdcaae581c95a325fb1e693fbb5';
              console.log('This is the ropsten test network.');
              $("#testNet").html(networkName +' Ropsten');
              break;
            case "4":
              contractAddress = '0x249651db6adf1378c885d6e5a4451697906d5bcc';
              console.log('This is the Rinkeby test network.');
              $("#testNet").html(networkName +' Rinkeby');
              break;
              case "42":
              contractAddress = '0x39e1bf3ea573e40b1b76995b20cae93d1c4d2518';
              console.log('This is the Kovan test network.');
              $("#testNet").html(networkName +' Kovan');
              break;

            default:
              console.log('This is an unknown network.');
              $("#testNet").html(networkName +' unknown');
              break;
          }
          App.initContract(contractAddress);
        })
      }  else {
        alert('You do not connect to any ethereum network!');
        return;
    }
     
      //return App.initContract(contractAddress);
    },
    initContract: function(contractAddress) {

      var SimpleVotingContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"name":"Voting","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"votingId","type":"uint256"}],"name":"votingEvent","type":"event"}]);
      
      App.contracts.SimpleVoting = SimpleVotingContract.at(contractAddress);

      console.log(App.contracts.SimpleVoting);
      App.initCandidate();
      return App.displayAccountInfo();
   
    },
    initCandidate: function(){
        let candidateNames = Object.keys(candidates);
        var votingInstance;
        for (var i = 0; i < candidateNames.length; i++) {
          let name = candidateNames[i];
          App.contracts.SimpleVoting.totalVotesFor.call(name,function(err,res){ 
            console.log(res);
            $("#" + candidates[name]).html(res.toString());
          });
         
        }
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
    reloadVoting: function() {
      // avoid reentry
      if (App.loading) {
        return;
      }
      App.loading = true;
  
      // refresh account information because the balance may have changed
  
      var votingInstance;
  
      App.contracts.SimpleVoting.deployed().then(function(instance) {
        votingInstance = instance;
        let candidateNames = Object.keys(candidates);
        for (var i = 0; i < candidateNames.length; i++) {
          let name = candidateNames[i];
          votingInstance.totalVotesFor.call(name).then(function(v) {
              $("#" + candidates[name]).html(v.toString());
            });
        }
        App.loading = false;
      }).catch(function(err) {
        console.log(err.message);
        App.loading = false;
      });
    },
  
    voteForCandidate: function( candidate) {

      let candidateName =   $('#candidate').find(":selected").text();
        try {
          $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.");
          $("#candidate").val("");
      
          var votingInstance;
          App.contracts.SimpleVoting.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]},function(err,res){ 
            console.log(res);

            let div_id = candidates[candidateName];
            App.contracts.SimpleVoting.totalVotesFor.call(candidateName,function(err1,res1){ 
              console.log(res);
              $("#" + candidates[candidateName]).html(res1.toString());
              $("#msg").html("");
            });
          });
        
        } catch (err) {
          console.log(err);
        }
       
    },
  
   
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
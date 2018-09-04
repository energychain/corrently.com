function updatePossibility() {
  var price = $('#cori_price').attr('data-price');
  if(typeof price == "undefined") return;

  var balance = $('#eth_balance').attr('data-balance');
  balance-=153900000000000;
  $('#numCoris').val(Math.floor((balance/price)*10000)/10000);

  $('.priceBuy').html((ethers.utils.formatEther(price)*$('#numCoris').val()).toFixed(4));
}
function unlockBrain() {
  $('#retrieveBalance').attr('disabled','disabled');

  $('#login_frm').hide();
    document.app.provider=ethers.providers.getDefaultProvider("homestead");
    ethers.Wallet.fromBrainWallet($('#username').val(),$('#password').val()).then(function(wallet) {
        $('#retrieveBalance').removeAttr('disabled');
        $('#wallet_address').val(wallet.address);
        console.log(wallet.address);
        document.app.wallet=wallet;
        document.app.wallet.provider=ethers.providers.getDefaultProvider("homestead");
        $('#directBuy').show();
        $('#indirectBuy').hide();
        document.app.getInfo();
    });
}

function web3Transfer() {
  $('#buyWeb3').attr('disabled','disabled');

  web3.eth.sendTransaction({from:web3.eth.coinbase, to:'0x61bdd888b3bd3f8466a4fb2e16435e917cd458a0', value: web3.toWei(1, "ether")},function(x) {
    $('#buyWeb3').removeAttr('disabled');
  });
}
$(document).ready(function() {
  document.app= {};

  document.app.getInfo=function() {
    var retrieveBalance=function() {
      $('#anyCoinLink').attr('href',"https://anycoindirect.eu/en/buy/ethers?discref=cea54a6e-3bb6-4e29-8da1-66427467438f&address="+$('#wallet_address').val());
      contract.balanceOf($('#wallet_address').val()).then(function(b) {
          $('#cori_balance').html((b.toString()/100).toFixed(2));
      });
      exd.balanceOf($('#wallet_address').val()).then(function(b) {
          $('#cori_dividend').html((ethers.utils.formatEther(b)*1).toFixed(6));
      });
      document.app.provider.getBalance($('#wallet_address').val()).then(function(balance) {
            $('#eth_balance').html((ethers.utils.formatEther(balance)*1).toFixed(7));
            $('#eth_balance').attr('data-balance',balance);
            updatePossibility();
      });
    }

      var e20abi=[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];
      var exDabi=[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalDividend","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawDividend","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalClaimed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"divMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"withdrawBonds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_token","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_value","type":"uint256"}],"name":"Dividend","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Payed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_value","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"}];

      var saleAbi=[
	{
		"constant": false,
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_price",
				"type": "uint256"
			},
			{
				"name": "_validFromBlock",
				"type": "uint256"
			}
		],
		"name": "setPrice",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "newOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "next_after",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "next_price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

    var contract = new ethers.Contract("0x725b190bc077ffde17cf549aa8ba25e298550b18", e20abi,ethers.providers.getDefaultProvider("homestead"));
    var exd = new ethers.Contract("0xa050b90B0C60900E304774Eb39220dFB2C5fFf0F", exDabi,ethers.providers.getDefaultProvider("homestead"));
    var sale = new ethers.Contract("0x61bdd888b3bd3f8466a4fb2e16435e917cd458a0", saleAbi,ethers.providers.getDefaultProvider("homestead"));
    contract.totalSupply().then(function(ts) {
        $('.totalSupply').html((ts.toString()/100).toFixed(2));
    });
    if(typeof document.app.provider == "undefined") {
      document.app.provider=ethers.providers.getDefaultProvider("homestead");
    }
    sale.price().then(function(price) {
      $('#cori_price').html((ethers.utils.formatEther(price)*100).toFixed(7))
      $('#cori_price').attr('data-price',price*100);
      $('#numCoris').on('change',function() {
          $('.priceBuy').html((ethers.utils.formatEther(price)*100*$('#numCoris').val()).toFixed(4));
      })

      $('#buyCors').click(function() {
          $('#buyCors').attr('disabled','disabled');
          var eths=($('#numCoris').val()*100)*price;

          document.app.wallet.send("0x61bdd888b3bd3f8466a4fb2e16435e917cd458a0",eths).then(function(x) {
              $('#buyCors').removeAttr('disabled');
              document.app.getInfo();
          });

      })
      updatePossibility();
    });
    document.app.provider.getBlockNumber().then(function(blockNumber) {

      sale.next_after().then(function(next_after)  {
          sale.next_price().then(function(next_price)  {
              console.log("next_price",next_price.toString());
          });
          console.log("next_after",next_after.toString());
      });

      $('.blockNumber').html(blockNumber);

    });


    $('#retrieveBalance').click(retrieveBalance);
    if((typeof web3 != "undefined") && (typeof web3.eth != "undefined")) {
        if($('#wallet_address').val().length<42) {
          $('#wallet_address').val(web3.eth.accounts[0]);
          retrieveBalance();
        }
    }
    if($('#wallet_address').val().length==42) {
      retrieveBalance();
    }

}
$('#btnWeb3').click(function() {
  $('#login_frm').show();
  $('#gotWeb3').hide();
})


if (typeof web3 !== 'undefined') {
      $('#login_frm').hide();
      $('#gotWeb3').show();
      var web3Provider = new ethers.providers.Web3Provider(web3.currentProvider,ethers.providers.getDefaultProvider("homestead"));
      web3Provider.getBalance("0xc430fAB09288C272A321C086d330609CD8b71447"). then(function(balance) {
        document.app.provider=web3Provider;
        var etherString = ethers.utils.formatEther(balance);
        document.app.getInfo();
      });
} else {
    document.app.provider=ethers.providers.getDefaultProvider("homestead");
    $('#login_frm').show();
    $('#gotWeb3').hide();
    $('#unlockUsername').click(unlockBrain);
}
  $.getJSON("./html/includes/build_info.json",function(d) {
      $('#build_block').html(d.blockNumber);
      $('#build_sign').html(d.signature.toString().substr(2,30));
  });
  $.getJSON("./data/asset_0480269a2bdb421b9f85e0f353e63c06.json",function(d) {
      var last_ts=0;
      var last_p =0;
      for(var i=0;i<d.values.length;i++) {
          if(d.values[i].ts>last_ts) {
              last_ts=d.values[i].ts;
              last_p=d.values[i].p;
          }
      }
      $('#asset1_performance').html((last_p*100).toFixed(2));
      $('#asset1_updated').html(new Date(last_ts).toLocaleString());
  });
  $.getJSON("./data/asset_0c56adc82680493f946599a2f00c1d6d.json",function(d) {
      var last_ts=0;
      var last_p =0;
      for(var i=0;i<d.values.length;i++) {
          if(d.values[i].ts>last_ts) {
              last_ts=d.values[i].ts;
              last_p=d.values[i].p;
          }
      }
      $('#asset2_performance').html((last_p*100).toFixed(2));
      $('#asset2_updated').html(new Date(last_ts).toLocaleString());
  });
});

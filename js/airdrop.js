function airdropSend() {
    _paq.push(['trackEvent', 'web3', 'wallet', 'transfer']);
    if($('#wallet_address').val().length!=42) {
        alert("Please use the login form (brain wallet) or a Web3 Provider to login");
    } else {
        $('#sendAirdrop').attr("disabled","disabled");
        if(typeof web3!="undefined") {
            web3.eth.sendTransaction({from:web3.eth.coinbase, to:'0xa050b90b0c60900e304774eb39220dfb2c5fff0f', value: web3.toWei(0.001, "ether")},function(x) {
              $('#sendAirdrop').removeAttr('disabled');
              $('#redim').removeAttr('disabled');
            });
        } else {
            document.app.wallet.send("0xa050b90b0c60900e304774eb39220dfb2c5fff0f",ethers.utils.parseEther("0.001")).then(function(x) {
                $('#sendAirdrop').removeAttr('disabled');
                $('#hash').val(x.hash);
                $('#redim').removeAttr('disabled');
            });
        }
    }
}


$('#wallet_address').on('change',function() {
    _paq.push(['trackEvent', 'web3', 'wallet', 'change']);
    $('#sendAirdrop').removeAttr('disabled');
});

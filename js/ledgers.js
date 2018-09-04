function shortName(kyc,address) {
  if(typeof kyc[address]=="undefined") {
    return address.substr(0,10)+"...";
  } else {
    return kyc[address].short_name;
  }

}

function app(kyc) {

  document.app={};
  document.app.provider=ethers.providers.getDefaultProvider("homestead");

  var provider = ethers.providers.getDefaultProvider();

  var e20abi=[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];

  //var contract = new ethers.Contract("0x725b190bc077ffde17cf549aa8ba25e298550b18", e20abi,ethers.providers.getDefaultProvider("homestead"));

  provider.getLogs({
      fromBlock: 6000000,
      toBlock: 'latest',
      address: "0x725b190bc077ffde17cf549aa8ba25e298550b18",
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
  }).then(function(results) {

    var cleaned=[];
    var processResult=function() {
        if(results.length>0) {
            var x = results.pop();
            x.from="0x"+x.topics[1].substr("0x000000000000000000000000".length);
            x.to="0x"+x.topics[2].substr("0x000000000000000000000000".length);
            x.cori =ethers.utils.bigNumberify(x.data).toString()*1/100;
            provider.getBlock(x.blockNumber).then(function(binfo) {
                x.timestamp=binfo.timestamp;
                x.to_friendly=shortName(kyc,x.to);
                x.from_friendly=shortName(kyc,x.from);
                cleaned.push(x);
                processResult();
            });
        } else {
            for(var i=0;i<cleaned.length;i++) {
                $('#ledgerIt').append("<tr><td title='Block:"+cleaned[i].blockNumber+"'>"+new Date(cleaned[i].timestamp*1000).toLocaleString()+"</td><td title='"+cleaned[i].from+"'><a href='./ledger_otc.html?a="+cleaned[i].from+"'>"+cleaned[i].from_friendly+"</a></td><td title='"+cleaned[i].to+"'><a href='./ledger_otc.html?a="+cleaned[i].to+"'>"+cleaned[i].to_friendly+"</a></td><td align='right'>"+cleaned[i].cori+"</td></tr>");
            }
            console.log(cleaned);
        }
    }

      processResult();
  })

}

$(document).ready(function() {
  $.getJSON("./data/kyc.json",function(kyc) {
        app(kyc);
  })

})

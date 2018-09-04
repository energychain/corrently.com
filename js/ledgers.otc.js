
$.qparam = function (name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                    .exec(window.location.search);

  return (results !== null) ? results[1] || 0 : false;
}

var e20abi=[{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}];


function shortName(kyc,address) {
  if(typeof kyc[address]=="undefined") {
    if(address==$.qparam('a')) { return "<span class='second'>this account</span>"; }
    if(address.length==0) return "/smart contract deployment/";
    return address.substr(0,10)+"...";
  } else {
    if(address==$.qparam('a')) { return "<span class='second'>"+kyc[address].short_name+"</span>"; }
    return kyc[address].short_name;
  }
}

function app(kyc) {

  document.app={};
  document.app.provider=ethers.providers.getDefaultProvider("homestead");

  var provider = ethers.providers.getDefaultProvider();
  var myname=shortName(kyc,$.qparam('a'));
  $('#account').html(myname);
  if(typeof kyc[$.qparam('a')].short_name!="undefined") {
  document.title =  kyc[$.qparam('a')].short_name+" Accounting";
  }
  if((typeof kyc[$.qparam('a')]!="undefined")&&(typeof kyc[$.qparam('a')].description!="undefined")) {
      $('#description').html(kyc[$.qparam('a')].description);
  }
  provider.getBalance($.qparam('a')).then(function(balance) {
    $('#balance').html((ethers.utils.formatEther(balance).toString()*1).toFixed(4));
    $('#balance').attr('data',ethers.utils.formatEther(balance).toString()*1);
    var contract = new ethers.Contract("0x725b190bc077ffde17cf549aa8ba25e298550b18", e20abi,ethers.providers.getDefaultProvider("homestead"));
    contract.balanceOf($.qparam('a')).then(function(cori_balance) {
        $('#cori').html((cori_balance.toString()/100).toFixed(2));
        $('#cori').attr('data',cori_balance.toString()*1);
        getTransactionsClean();
    });
  });


  function getTransactionsClean() {
    var startblock=6000000;
    if((window.localStorage.getItem("txcache_"+$.qparam('a'))!=null)&&($.qparam('reset')==null)) {
      txcache=JSON.parse(window.localStorage.getItem("txcache_"+$.qparam('a')));
      startblock=txcache[txcache.length-1].blockNumber;
    } else {
      txcache=[];
    }
    //startblock=6000000;
    $.getJSON("https://api.etherscan.io/api?module=account&action=txlist&address="+$.qparam('a')+"&startblock="+startblock+"&endblock=99999999&sort=asc&apikey=YourApiKeyToken",function(remoteCacheIt) {
      $.getJSON("https://api.etherscan.io/api?module=account&action=txlistinternal&address="+$.qparam('a')+"&startblock="+startblock+"&endblock=99999999&sort=asc&apikey=YourApiKeyToken",function(remoteCacheIn) {
      results=[];
      for(var i=0;i<txcache.length;i++) { results.push(txcache[i]); }
      // Merge the two lists into one
      var results_cache={};
      for(var i=0;i<remoteCacheIt.result.length;i++) {
        results_cache[remoteCacheIt.result[i].blockNumber]=remoteCacheIt.result[i];
        results.push(remoteCacheIt.result[i]);
      }
      for(var i=0;i<remoteCacheIn.result.length;i++) {
        if(typeof results_cache[remoteCacheIn.result[i].blockNumber]=="undefined") {
            results.push(remoteCacheIn.result[i]);
        } else {
            console.log("compare",results_cache[remoteCacheIn.result[i].blockNumber],  remoteCacheIn.result[i]);
            remoteCacheIn.result[i].blockNumber=remoteCacheIn.result[i].blockNumber+"_internal";
            results.push(remoteCacheIn.result[i]);
        }
      }

      var cleaned=[];
      var block_numbers=[];
      function nextResult() {
        /**********************************
        * Fix issue with mising txs if both internal and external
        **********************************/

        if(results.length>0) {
            x= results.pop();
            x.eth=ethers.utils.formatEther(x.value);
            x.timestamp=x.timeStamp;
            x.to_friendly=shortName(kyc,x.to);
            x.from_friendly=shortName(kyc,x.from);
            if(typeof block_numbers["b_"+x.blockNumber]=="undefined" ) {
                block_numbers["b_"+x.blockNumber]=x.blockNumber;
                if(window.localStorage.getItem("b_"+x.blockNumber)==null) {
                  $.getJSON("https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts="+x.timestamp+"&extraParams=corrently",function(info) {
                    console.log("Missing Time",info,x.blockNumber);
                      window.localStorage.setItem("b_"+x.blockNumber,info.ETH.EUR);
                      x.eur=x.eth*info.ETH.EUR;
                      cleaned.push(x);
                      nextResult();
                  });
                } else {
                  x.eur=x.eth*window.localStorage.getItem("b_"+x.blockNumber);
                  x.rate=window.localStorage.getItem("b_"+x.blockNumber);
                  cleaned.push(x);
                  nextResult();
                }
            } else {
              nextResult();
            }
          } else {
            balance_assets=[];
            balance_liabilities=[];
            var cnt_assets=0;
            var cnt_liabilities=0;
            var gas_used=0;
            for(var i=0;i<cleaned.length;i++) {
              if(cleaned[i].eur>-0.0001) {
                $('#ledgerIt').append("<tr><td title='Block:"+cleaned[i].blockNumber+"'>"+new Date(cleaned[i].timestamp*1000).toLocaleString()+"</td><td title='"+cleaned[i].from+"'><a href='./ledger_otc.html?a="+cleaned[i].from+"'>"+cleaned[i].from_friendly+"</a></td><td title='"+cleaned[i].to+"'><a href='./ledger_otc.html?a="+cleaned[i].to+"'>"+cleaned[i].to_friendly+"</a></td><td align='right'>"+cleaned[i].eur.toFixed(2)+"</td><td align='right'>"+(cleaned[i].eth*1).toFixed(4)+"</td></tr>");
                var balance_entry={};
                balance_entry.eur=cleaned[i].eur;
                balance_entry.eth=cleaned[i].eth;
                if(cleaned[i].to==$.qparam('a')) {
                    balance_entry.peer=cleaned[i].from;
                    balance_entry.peer_friendly=cleaned[i].from_friendly;
                    balance_entry.eth=balance_entry.eth*1;
                    balance_entry.eur=balance_entry.eur*1;
                    if(typeof balance_liabilities[cleaned[i].from]=="undefined") {
                        balance_liabilities[cleaned[i].from]=balance_entry;
                        cnt_assets++;
                    } else {
                      balance_liabilities[cleaned[i].from].eth+=balance_entry.eth*1;
                      balance_liabilities[cleaned[i].from].eur+=balance_entry.eur*1;
                    }

                }
                if(cleaned[i].from==$.qparam("a")) {
                  balance_entry.peer=cleaned[i].to;                  
                  if(cleaned[i].type!="call") {
                    gas_used+=ethers.utils.formatEther(cleaned[i].gasUsed)*ethers.utils.formatEther(cleaned[i].gasPrice*1);
                  }
                  balance_entry.peer_friendly=cleaned[i].to_friendly;
                  balance_entry.eth=balance_entry.eth*1;
                  balance_entry.eur=balance_entry.eur*1;
                  if(typeof balance_assets[cleaned[i].to]=="undefined") {
                    balance_assets[cleaned[i].to]=balance_entry;
                    cnt_liabilities++
                  } else {
                    balance_assets[cleaned[i].to].eth+=balance_entry.eth*1;
                    balance_assets[cleaned[i].to].eur+=balance_entry.eur*1;
                  }
                }
              }
            }
            gasUsed=gas_used;
            var asset_rows=[];
            var asset_eths=gasUsed*1;
            var asset_eurs=0;
            for (var key in balance_assets) {
                var row="<td><a href='?a="+key+"'>"+balance_assets[key].peer_friendly+"</a></td><td align='right'>"+balance_assets[key].eur.toFixed(2)+"</td><td align='right'>"+balance_assets[key].eth.toFixed(4)+"</td>";
                asset_eths+=balance_assets[key].eth;
                asset_eurs+=balance_assets[key].eur;
                if(balance_assets[key].eth>0) {
                  asset_rows.push(row);
                }
            };

            var liability_rows=[];
            var liability_eths=0;
            var liability_eurs=0;



            for (var key in balance_liabilities) {
                var row="<td><a href='?a="+key+"'>"+balance_liabilities[key].peer_friendly+"</a></td><td align='right'>"+balance_liabilities[key].eur.toFixed(2)+"</td><td align='right'>"+balance_liabilities[key].eth.toFixed(4)+"</td>";
                liability_eths+=balance_liabilities[key].eth;
                liability_eurs+=balance_liabilities[key].eur;
                if(balance_liabilities[key].eth>0) {
                    liability_rows.push(row);
                }
            };

            // Add Abgrenzungsposten
            var xrate_assets=asset_eurs/asset_eths;
            var xrate_liability=liability_eurs/liability_eths;
            asset_eurs+=gasUsed*xrate_assets;
            var eth_price_cori=ethers.utils.formatEther(462313000000000);
            var cori_val=$('#cori').attr('data')*eth_price_cori;
            var cori_eur=$('#cori').attr('data')*eth_price_cori*xrate_liability;
            liability_eths+=cori_val*1;
            liability_eurs+=cori_eur*1;

            liability_rows.push("<td>CORI</td><td style='text-align:right'>"+((cori_eur).toFixed(2))+"</td><td style='text-align:right' >"+((cori_val).toFixed(4))+"</td>");

            asset_rows.push("<td>Transaction Costs</td><td style='text-align:right'>"+(gasUsed*xrate_assets).toFixed(2)+"</td><td style='text-align:right'>"+((gasUsed*1).toFixed(4))+"</td>");
            if($('#balance').attr('data')!=null) {
              asset_eths+=$('#balance').attr('data')*1;
              asset_eurs+=$('#balance').attr('data')*1*xrate_assets;
              var accurals=liability_eths-asset_eths;
              if(accurals>0) {
                  asset_eths+=accurals;
                  asset_eurs+=accurals*xrate_assets;
                  asset_rows.push("<td>Accruals and Deferrals (SC)</td><td style='text-align:right'>"+((accurals*xrate_assets).toFixed(2))+"</td><td style='text-align:right' >"+((accurals).toFixed(4))+"</td>");
              } else {
                accurals=Math.abs(accurals);
                liability_eths+=accurals;
                liability_eurs+=accurals*xrate_assets;
                liability_rows.push("<td>Accruals and Deferrals (SC)</td><td style='text-align:right'>"+((accurals*xrate_assets).toFixed(2))+"</td><td style='text-align:right' >"+((accurals).toFixed(4))+"</td>");
              }
              asset_rows.push("<th class='second'>BC Account</th><th style='text-align:right' class='second'>"+(($('#balance').attr('data')*xrate_assets).toFixed(2))+"</th><th style='text-align:right' class='second'>"+(($('#balance').attr('data')*1).toFixed(4))+"</th>");

            }

            if(asset_eurs>liability_eurs) {
              liability_rows.push("<td>Exchange Profit (EUR/ETH)</td><td style='text-align:right'>"+((asset_eurs-liability_eurs).toFixed(2))+"</td><td style='text-align:right' >0</td>");
              liability_eurs+=asset_eurs-liability_eurs;
            } else {
              asset_rows.push("<td>Exchange Loss (EUR/ETH)</td><td style='text-align:right'>"+((liability_eurs-asset_eurs).toFixed(2))+"</td><td style='text-align:right' >0</td>");
              asset_eurs+=liability_eurs-asset_eurs;
            }
            // resulting
            var html="";
            var cnt=asset_rows.length;
            if(liability_rows.length>asset_rows.length) cnt=liability_rows.length;


            for(var i=0;i<cnt;i++) {
              html+="<tr>";
              if(i<asset_rows.length) html+=asset_rows[i]; else html+="<td colspan=3>&nbsp;</td>";
              if(i<liability_rows.length) html+=liability_rows[i]; else html+="<td colspan=3>&nbsp;</td>";
              html+="</tr>";
            }
            html+="<tr><th>&nbsp;</th><th style='text-align:right'>"+asset_eurs.toFixed(2)+"</th><th style='text-align:right'>"+asset_eths.toFixed(4)+"</th>Balance<th></th><th style='text-align:right'>"+liability_eurs.toFixed(2)+"</th><th style='text-align:right'>"+liability_eths.toFixed(4)+"</th></tr>";
            $('#balanceSheet').append(html);

            window.localStorage.setItem("txcache_"+$.qparam('a'),JSON.stringify(cleaned));
          }
      }
      nextResult();
    });
    });
  }





}
$(document).ready(function() {
  $.getJSON("./data/kyc.json",function(kyc) {
    $.getJSON("/data/xchangerate.json",function(xrates) {
          $.each(xrates,function(key,value) {
                window.localStorage.setItem(key,value);
          });
          app(kyc);
    });
  })

})

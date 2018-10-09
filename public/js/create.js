function reenableCreate() {
  $("#createAccountNow").show();
  $("#gearsCreate").hide();
}

$("#createAccountNow").click(function(e){
  e.preventDefault();
  $(this).hide();
  $("#gearsCreate").show();
  let loggedIn = false;
  let pass = $("#createActiveKey").val();
  if(steem.auth.isWif(pass)) {
    key = pass;
  } else {
    key = steem.auth.toWif(username, pass, 'active');
  }

  pub = steem.auth.wifToPublic(key);
  steem.api.getAccounts([username],function(err,result){
    var threshold = result[0]['active']['weight_threshold'];
    var auths = result[0]['active']['key_auths'];
    for(var i = 0; i < auths.length; i++) {
      if(auths[i][1] >= threshold && auths[i][0] == pub) {
        loggedIn = true;
        let wif = key;
        let steempervest = properties.global.total_vesting_fund_steem.slice(0,-6) / properties.global.total_vesting_shares.slice(0,-6);
        let delegation = (Math.floor($("#createSP").val() / steempervest * 1000000) / 1000000) +' VESTS';
        let newAccountName = $("#createAccountName").val();
        let owner = {'key_auths':[[$("#createOwner").val(),1]],'account_auths':[],'weight_threshold':1};
        let active = {'key_auths':[[$("#createActive").val(),1]],'account_auths':[],'weight_threshold':1};
        let posting = {'key_auths':[[$("#createPosting").val(),1]],'account_auths':[],'weight_threshold':1};
        let memoKey = $("#createMemo").val();
        createClaimedAccount(wif,newAccountName,owner,active,posting,memoKey,delegation);
      }
    }

    if(loggedIn == false) {
      alert('Please provide your own active key for account creation');
      reenableCreate();
    }
  });
});

function createClaimedAccount(w, newAccountName, owner, active, posting, memoKey, delegation) {
  let tx = {
    'operations': [[
      'create_claimed_account', {
        'creator': username,
        'new_account_name': newAccountName,
        'owner': owner,
        'active': active,
        'posting': posting,
        'memo_key': memoKey,
        'json_metadata': '{}'
      }
    ]]
  }
  steem.broadcast._prepareTransaction(tx).then(function(tx){
    console.log(tx);
    tx = steem.auth.signTransaction(tx, [w]);
    let callback = function(err, success) {
      if(!err) {
        alert('account successfully created');
        reenableCreate();
        $.ajax({
          url: "api/delete",
          data: {
            account: newAccountName,
            creator: username
          },
          type: "POST"
        }).fail(function(){
          alert('something went wrong');
        }).done(function( data ) {
          if(data['error']) {
            alert(data['error']);
          } else {
            if(delegation != '0 VESTS') {
              steem.broadcast.delegateVestingShares(w, username, newAccountName, delegation, function(err, result) {
                if(err !== null) {
                  alert(err);
                } else {
                  console.log(result);
                }
                console.log(err, result);
              });
            }
            $(".row"+newAccountName).remove();
            $('#createModal').modal('toggle');
            setProperties();
          }
        });
      } else {
        alert('Account creation failed. Maybe an account with that name already exists?');
        reenableCreate();
        console.log(err);
      }
    }
    steem.api.broadcastTransactionSynchronous(tx, callback);
  });
}
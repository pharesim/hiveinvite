function reenableCreate() {
  showById('createAccountNow');
  hideById('gearsCreate');
}

document.getElementById('createAccountNow').onclick = async function() {
  console.log('test');
  hideById('createAccountNow');
  showById('gearsCreate');

  let hivepervest = properties.global.total_vesting_fund_hive.slice(0,-5) / properties.global.total_vesting_shares.slice(0,-6);
  let delegation = Math.floor(getValueById('createSP') / hivepervest).toFixed(6);
  console.log(delegation);
  let newAccountName = getValueById('createAccountName');
  let owner = JSON.stringify({'key_auths':[[getValueById('createOwner'),1]],'account_auths':[],'weight_threshold':1});
  let active = JSON.stringify({'key_auths':[[getValueById('createActive'),1]],'account_auths':[],'weight_threshold':1});
  let posting = JSON.stringify({'key_auths':[[getValueById('createPosting'),1]],'account_auths':[],'weight_threshold':1});
  let memoKey = getValueById('createMemo');
  //createClaimedAccount(wif,newAccountName,owner,active,posting,memoKey,delegation);
  const keychain = window.hive_keychain;
  console.log(owner);
  console.log(active);
  console.log(posting);
  console.log(memoKey);
  keychain.requestCreateClaimedAccount(username, newAccountName, owner, active, posting, memoKey, (response) => {
    console.log(response);
    if(response.success !== false) {
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
            keychain.requestDelegation(username, newAccountName, delegation, 'VESTS', function(err, result) {
              if(err !== null) {
                alert(err);
              } else {
                console.log(result);
              }
              console.log(err, result);
            });
          }
          $(".row"+newAccountName).remove();
          // @todo modal is part of bootstrap, kept json above out of convenience too
          $('#createModal').modal('toggle');
          setProperties();
        }
      });
    } else {
      alert('Account creation failed. This can have a multitude of reasons.');
      reenableCreate();
      console.log(err);
    }
  });
}

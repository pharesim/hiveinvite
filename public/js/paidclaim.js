function validatePaidClaimModalForm() {
  let value = getValueById('paidClaimActiveKey');
  if(hivejs.auth.isWif(value)) {
    document.getElementById('paidClaimSubmit').disabled = false;
     return true;
  }

  document.getElementById('paidClaimSubmit').disabled = true;
  return false;
}

validatePaidClaimModalForm();
document.getElementById('paidClaimActiveKey').oninput = function() {
  validatePaidClaimModalForm();
}

document.getElementById('paidClaimSubmit').onclick = function() {
  showById('gearsPaidClaim');
  hideById('paidClaimSubmit');

  wif = getValueById('paidClaimActiveKey');
  setStoreWIF(document.getElementById('storeWIFpaid').checked); 
  let callback = function(err, result) {
    if(err !== null) {
      alert(err);
    } else {
      setProperties();
      alert('Account claimed');

      // @todo modal is part of bootstrap
      $("#paidClaimModal").modal('hide');
    }

    hideById('gearsPaidClaim');
    showById('paidClaimSubmit');
  }
  claim_account(wif,callback,'3');
  getStoreWIF();
}

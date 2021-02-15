function validateFreeClaimModalForm() {
  let value = getValueById('freeClaimActiveKey');
  if(hivejs.auth.isWif(value)) {
    document.getElementById('singleFreeClaim').disabled = false;
    document.getElementById('botFreeClaim').disabled = false;
    return true;
  }

  document.getElementById('singleFreeClaim').disabled = true;
  document.getElementById('botFreeClaim').disabled = true;
  return false;
}

validateFreeClaimModalForm();
document.getElementById('freeClaimActiveKey').oninput = function() {
  validateFreeClaimModalForm();
}
document.getElementById('singleFreeClaim').onclick = function() {
  showById('gearsSingleFreeClaim');
  hideById('botFreeClaim');
  hideById('singleFreeClaim');

  wif = getValueById('freeClaimActiveKey');
  setStoreWIF(document.getElementById('storeWIFfree').checked); 
  let callback = function(err, result) {
    if(err !== null) {
      alert(err);
    } else {
      setProperties();
      alert('Account claimed');

      // @todo modal is part of bootstrap
      $("#freeCLaimModal").modal('hide');
    }
    hideById('gearsSingleFreeClaim');
    hideById('botFreeClaim');
    hideById('singleFreeClaim');
  }
  claim_account(wif,callback);
  getStoreWIF();
}

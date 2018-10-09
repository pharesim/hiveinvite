function validateFreeClaimModalForm() {
  let value = document.getElementById('freeClaimActiveKey').value;
  if(steem.auth.isWif(value)) {
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
  document.getElementById('gearsSingleFreeClaim').style.display = 'block';
  document.getElementById('botFreeClaim').style.display = 'none';
  document.getElementById('singleFreeClaim').style.display = 'none';

  wif = document.getElementById('freeClaimActiveKey').value;
  setStoreWIF(document.getElementById('storeWIFfree').checked); 
  let callback = function(err, result) {
    if(err !== null) {
      alert(err);
    } else {
      setProperties();
      alert('Account claimed');
      $("#freeCLaimModal").modal('hide');
    }
    document.getElementById('gearsSingleFreeClaim').style.display = 'none';
    document.getElementById('botFreeClaim').style.display = 'block';
    document.getElementById('singleFreeClaim').style.display = 'block';
  }
  claim_account(wif,callback);
  getStoreWIF();
}
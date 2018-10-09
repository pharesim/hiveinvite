function validatePaidClaimModalForm() {
  let value = document.getElementById('paidClaimActiveKey').value;
  if(steem.auth.isWif(value)) {
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
  document.getElementById('gearsPaidClaim').style.display = 'block';
  document.getElementById('paidClaimSubmit').style.display = 'none';

  wif = document.getElementById('paidClaimActiveKey').value;
  setStoreWIF(document.getElementById('storeWIFpaid').checked); 
  let callback = function(err, result) {
    if(err !== null) {
      alert(err);
    } else {
      setProperties();
      alert('Account claimed');
      $("#paidClaimModal").modal('hide');
    }

    document.getElementById('gearsPaidClaim').style.display = 'none';
    document.getElementById('paidClaimSubmit').style.display = 'block';
  }
  claim_account(wif,callback,'3');
  getStoreWIF();
}
var bot_running = 0;

function botOff() {
  bot_running = 0;
  getStoreWIF(); 
  setProperties();
}

document.getElementById('botClaimStart').onclick = function() {
  document.getElementById('botClaimStart').style.display = 'none';
  document.getElementById('botClaimStatus').style.display = 'block';
  document.getElementById('botIsWorking').style.display = 'block';
  bot_running = 1;
  wif = document.getElementById('freeClaimActiveKey').value;
  setStoreWIF(document.getElementById('storeWIFfree').checked); 
  let callback = function(err, success) {
    if(err !== null) {
      document.getElementById('botStoppedWithError').style.display = 'block';
      document.getElementById('botIsWorking').style.display        = 'none';
      let elem = document.getElementById('botClaimStatus');
      document.getElementById('botClaimError').innerHTML = err;
      botOff();
    } else {
      increment(document.getElementById('botClaimStatusClaimed'));
      increment(document.getElementById('botClaimHasClaimed'));
    }
  }
  
  botclaims(callback);
}

async function botclaims(callback) {
  while (bot_running == 1) {
    claim_account(wif,callback);
    await sleep(5000);
  }
}

function botClose() {
  botOff();
  document.getElementById('botClaimStart').style.display = 'block';
  document.getElementById('botClaimStatus').style.display = 'none';
  document.getElementById('botClaimError').innerHTML = '';
  document.getElementById('botClaimStatusClaimed').innerHTML = 0;
  document.getElementById('botClaimHasClaimed').innerHTML = 0;
  document.getElementById('botStoppedWithError').style.display = 'none';
}

$('#botClaimModal').on('hidden.bs.modal', function () {
  botClose();
});
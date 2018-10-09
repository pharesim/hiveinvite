var bot_running = 0;

function botOff() {
  bot_running = 0;
  getStoreWIF(); 
  setProperties();
}

document.getElementById('botClaimStart').onclick = function() {
  hideById('botClaimStart');
  showById('botClaimStatus');
  showById('botIsWorking');
  bot_running = 1;
  wif = getValueById('freeClaimActiveKey');
  setStoreWIF(document.getElementById('storeWIFfree').checked); 
  let callback = function(err, success) {
    if(err !== null) {
      showById('botStoppedWithError');
      hideById('botIsWorking');
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
  showById('botClaimStart');
  hideById('botClaimStatus');
  document.getElementById('botClaimError').innerHTML = '';
  document.getElementById('botClaimStatusClaimed').innerHTML = 0;
  document.getElementById('botClaimHasClaimed').innerHTML = 0;
  hideById('botStoppedWithError');
}

// @todo modals are part of bootstrap, so this uses jquery. remember to adapt when migrating away
$('#botClaimModal').on('hidden.bs.modal', function () {
  botClose();
});
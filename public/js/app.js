steem.api.setOptions({ url: 'https://api.steemit.com' });

var username  = null;
var store_wif = 0;
var wif       = '';
var account   = null;

var properties        = {'global':null,'chain':null};

var pending_invites   = 0;

var state = {
  'claim_cost_mana': 0,
  'max_rc': 0,
  'current_mana': 0,
  'balance': 0
}

//*** js helper functions ***/

function hideById(id) {
  document.getElementById(id).style.display = 'none';
}

function showById(id) {
  document.getElementById(id).style.display = 'block';
}

function getValueById(id) {
  return document.getElementById(id).value;
}

function setContentById(id,content) {
  document.getElementById(id).innerHTML = content;
}

function setContentByClass(classname,content) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].innerHTML = content;
  } 
}

function setValueById(id,value) {
  document.getElementById(id).value = value;
}

function setValuesByClass(classname,value) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].value = value;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function increment(elem) {
  elem.innerHTML = parseInt(elem.innerHTML) + 1;
  return true;
}

//*** state handling functions */

function getState(id) {
  return state[id];
}

function setState(id,value) {
  state[id] = value;
  if(id == 'claim_cost_mana' || id == 'max_rc' || id == 'current_mana') {
    updateRCState();
  } else if(id == 'balance') {
    updateBalanceState();
  }
}

//*** WIF storage handling ***/

function setStoreWIF(store) {
  if(store == true) {
    setValuesByClass('activeKeyInput',wif);
    store_wif = 1;
  } else {
    store_wif = 0;
  }
}

function getStoreWIF() {
  if(store_wif == 0) {
    setValuesByClass('activeKeyInput','');
    wif = '';
  } else {
    setStoreWIF(store_wif);
  }
}

//*** steem helper functions ***/

function fillThreeZeroes(amount) {
  let s = amount;
  let t = s.split('.');
  if (t.length == 1) {
    t[1] = '000';
    s = s+'.'+t[1];
  }
  for(var j = t[1].length; j < 3; j++) {
    s = s+'0';
  }

  return s;
}


//*** steem api calls ***/
async function claim_account(w,callback,fee = '0') {
  let tx = {
    'operations': [[
      'claim_account', {
        'creator': username,
        'fee': fillThreeZeroes(fee)+' STEEM'
      }
    ]]
  }
  steem.broadcast._prepareTransaction(tx).then(function(tx){
    tx = steem.auth.signTransaction(tx, [w]);
    steem.api.broadcastTransactionSynchronous(tx, callback);
  });
}

//*** RC helper functions ***/
function formatRC(rc) {
  mana = Math.round(rc / 10000) / 100;
  if(mana >= 1000000) {
    mana = Math.round(mana / 10000) / 100 +'M';
  }
  return mana+'M';
}

function calculateRC() {
  calculateClaimRC();
  calculateUserRC();
}

function calculateClaimRC() {
  let rc_regen = Math.round(properties.global.total_vesting_shares.slice(0,-6) / ((60*60*24*5)/3)) * 1000000;
  let total_cost = 0;
  let resource_count = {};
  steem.api.callAsync('rc_api.get_resource_params', {}).then(result => {
    steem.api.callAsync('rc_api.get_resource_pool', {}).then(result2 => {
      resource_count.resource_history_bytes = 300;
      resource_count.resource_state_bytes = 174 * 35;
      resource_count.resource_state_bytes += 174 * 300;
      resource_count.resource_new_accounts = 1;

      Object.keys(resource_count).forEach(key => {
        let denom = 0;
        let num = result.resource_params[key].price_curve_params.coeff_a;
        num = num * rc_regen;
        for(let i = 0; i < result.resource_params[key].price_curve_params.shift; i++) {
          num = num / 2;
        }
        num = num + 1;
        num = num * result.resource_params[key].resource_dynamics_params.resource_unit;
        denom = result.resource_params[key].price_curve_params.coeff_b + result2.resource_pool[key].pool;
        let num_denom = Math.round(num / denom);
        total_cost = total_cost + num_denom;    
      });
      
      setState('claim_cost_mana',total_cost);
    });
  });
}

function calculateUserRC() {
  steem.api.callAsync('rc_api.find_rc_accounts', {accounts: [username]}).then(async function(result) {
    let max_rc = result.rc_accounts[0].max_rc;
    let last_mana = result.rc_accounts[0].rc_manabar.current_mana;
    let head_block = properties.global.head_block_number;
    let last_update = result.rc_accounts[0].rc_manabar.last_update_time;
    steem.api.getBlockHeader(head_block, function(err, result) {
      var offset = new Date().getTimezoneOffset();
      let current_timestamp = Math.round(new Date(result.timestamp).getTime()/1000)-(60*offset);
      let elapsed = current_timestamp - last_update;
      let current_mana = parseFloat(last_mana) + elapsed * max_rc / 432000;
      if(current_mana > max_rc) {
        current_mana = max_rc;
      }

      setState('current_mana',current_mana);
    });  
    
    setState('max_rc',max_rc);
  });
}

//*** validation functions ***/
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

async function appstart() {
  //  localStorage.removeItem("username");
  if (localStorage.username) {
    hideById('loggedOut');
    username = localStorage.username;
    steem.api.getAccounts([username], async function(err, response){
      account = response[0];
      setState('balance',account.balance.slice(0,-6));
      calculateRC();
      getInvites();
      await sleep(1000);
      fillLoggedIn();
      showById('loggedIn');
    });
  } else {
    translateIndexContent();
    hideById('loggedIn');
    showById('loginButtonContainer');
    hideById('loginFormContainer');
    showById('loggedOut');
  }
}

function setProperties() {
  steem.api.getDynamicGlobalProperties(async function(err, result) {
    properties.global = result;
    translateIndexContent();
    appstart();
    setUpdated();
  });
  
  steem.api.getChainProperties(function(err, result) {
    properties.chain = result;
  });
}

setProperties();
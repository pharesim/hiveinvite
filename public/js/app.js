steem.api.setOptions({ url: 'https://api.steemit.com' });

var username  = null;
var store_wif = 0;
var wif       = '';
var account   = null;
var balance   = 0;
var max_rc    = 0;

var properties        = {'global':null,'chain':null};
var claim_cost_steem  = 0;
var claim_cost_mana   = 0;

var remaining_invites = 0;
var pending_invites   = 0;
var steem_accounts    = 0;
var current_mana      = 0;
var current_timestamp = 0;

//*** js helper functions ***/

function setContentByClass(classname,content) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].innerHTML = content;
  } 
}

function setValuesByClass(classname,value) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].value = value;
  }
}

function hideById(id) {
  document.getElementById(id).style.display = 'none';
}

function showById(id) {
  document.getElementById(id).style.display = 'block';
}

function setContentById(id,content) {
  // console.log(id);
  document.getElementById(id).innerHTML = content;
}

function getValueById(id) {
  return document.getElementById(id).value;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function increment(elem) {
  elem.innerHTML = parseInt(elem.innerHTML) + 1;
  return true;
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
        num_denom = Math.round(num / denom);
        total_cost = total_cost + num_denom;    
      });
      claim_cost_mana = total_cost;

      appstart();
    });
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
    username = localStorage.username;
    steem.api.getAccounts([username], function(err, response){
      account = response[0];
      steem.api.callAsync('rc_api.find_rc_accounts', {accounts: [username]}).then(async function(result) {
        max_rc = result.rc_accounts[0].max_rc;
        last_mana = result.rc_accounts[0].rc_manabar.current_mana;
        elapsed = current_timestamp - result.rc_accounts[0].rc_manabar.last_update_time;
        current_mana = parseFloat(result.rc_accounts[0].rc_manabar.current_mana) + elapsed * max_rc / 432000;
        if(current_mana > max_rc) {
          current_mana = max_rc;
        }
        hideById('loggedOut');
        
        getInvites();
      });
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
    let head_block = result.head_block_number;
    steem.api.getBlockHeader(head_block, function(err, result) {
      var offset = new Date().getTimezoneOffset();
      current_timestamp = Math.round(new Date(result.timestamp).getTime()/1000)-(60*offset);
    });
    properties.global = result;
    calculateClaimRC();
    setUpdated();
  });
  
  steem.api.getChainProperties(function(err, result) {
    properties.chain = result;
  });
}

setProperties();
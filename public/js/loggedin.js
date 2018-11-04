function setUpdated() {
  var d = new Date();
  h = (d.getHours()<10?'0':'') + d.getHours(),
  m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  s = (d.getSeconds()<10?'0':'') + d.getSeconds();
  document.getElementById('lastupdated').innerHTML = h+':'+m+':'+s;
}

let elem = document.getElementById('languageSelector');
elem.onchange = function() {
  if(elem.value != '') {
    hideById('loggedIn');
    i18next.changeLanguage(elem.value);    
    translateIndexContent();
    setProperties();
  }
}

document.getElementById('logoutButton').onclick = function() {
  localStorage.removeItem("username");
  window.location.href = "/";
}

// @todo migrate from jquery to vanilla
function getInvites() {
  $.ajax({
    url: "api/invite",
    data: {
      "username": username
    },
    type: "POST"
  }).fail(function(){
    alert('something went wrong');
  }).done(function( data ) {
    if(data['error']) {
      alert(data['error']);
    } else {
      insertIntoTable(data);
    }
  });
}

function updateRCState() {
  let max_rc = getState('max_rc');
  let claim_cost_mana = getState('claim_cost_mana');
  let current_mana = getState('current_mana');

  let pct = current_mana * 100 / max_rc;
  let maxclaims = Math.floor(max_rc / claim_cost_mana);
  let possibleclaims = Math.floor(current_mana / claim_cost_mana);

  if(maxclaims > 0) {
    setContentById('canclaimever',i18next.t('index.canclaim',{'count': maxclaims}));
    setContentById('maxclaims',maxclaims);
    showById('canclaimnow');
  } else {
    setContentById('canclaimever',i18next.t('index.cannotclaim'));
    hideById('canclaimnow');
  }

  if(possibleclaims > 0) {
    setContentById('canclaimnowamount',i18next.t('index.canclaimnow',{'count': possibleclaims}));
    setContentByClass('possibleclaims',possibleclaims);
    let elems = document.getElementsByClassName('freeclaims_multiple');
    for(let i = 0; i < elems.length; i++) {
      if(possibleclaims < 2) {
        elems[i].style.display = 'none';
      } else {
        elems[i].style.display = 'block';
      }
    }

    showById('claimfreebutton');
  } else {
    setContentById('canclaimnowamount',i18next.t('index.cannotclaimnow'));
    hideById('claimfreebutton');
  }

  setContentById('freeExplainAmount',i18next.t('freeclaimmodal.explainamount',{'count': possibleclaims}));
  setContentById('currentrc',formatRC(current_mana));
  setContentById('rcpct',Math.round(pct * 100) / 100);
  setContentByClass('rccost',formatRC(claim_cost_mana));
  setContentById('maxrc',formatRC(max_rc));
}

function updateBalanceState() {
  steem.api.getChainProperties(function(err, result) {
    let claim_cost_steem = result.account_creation_fee.slice(0,-6);
    let balance = getState('balance');
    let steem_accounts = Math.floor(balance / claim_cost_steem);

    if(steem_accounts > 0) {
      setContentById('abletopayforclaim',i18next.t('index.canbuy',{'count': steem_accounts}));
      setContentById('possiblebuys',steem_accounts);
      showById('claimsteembutton');
    } else {
      setContentById('abletopayforclaim',i18next.t('index.cannotbuy'));
      hideById('claimsteembutton');
    }

    setContentByClass('steemcost',claim_cost_steem);
    setContentById('steembalance',balance);
  });
}

// fill in data
function fillLoggedIn() { 
  let emailText = document.getElementById('emailText').innerHTML;

  remaining_invites = account.pending_claimed_accounts - pending_invites;
  if(account.pending_claimed_accounts > 0) {
    setContentById('pendingclaimsandinvites',i18next.t('index.pendingclaims',{'count': account.pending_claimed_accounts}));
    setContentById('pendingclaims',account.pending_claimed_accounts);
    if(pending_invites > 0) {
      setContentById('invitespending',i18next.t('index.invitespending',{'count': pending_invites}));
    } else {
      setContentById('invitespending',i18next.t('index.noinvitespending'));
    }   
    setContentById('pendinginvites',pending_invites);
    setContentById('invitemore',i18next.t('index.invitemore',{'count': remaining_invites}))
    setContentById('remaininginvites',remaining_invites);
  } else {
    setContentById('pendingclaimsandinvites',i18next.t('index.nopendingclaims'));
  }
  
  setContentById('emailText',emailText.replace("{}",username));

  if(remaining_invites > 0) {
    showById('inviteModalButton');
  } else {
    hideById('inviteModalButton')
  }
}

inviteData = {}
function insertIntoTable(data) {
  // @todo refactor in own function to get rid of jquery
  $("#pendingInvites").empty();
  pending_invites = 0
  for(var i = 0, len = data.length; i < len; i++) {
    pending_invites += 1;
    let append = '<tr class="row'+data[i]['account']+'"><td>';

    append = append+data[i]['label'];
    append = append+'</td><td>';

    if(data[i]['address'] == null) {
      data[i]['address'] = '<a href="/accept.html?inviteid='+data[i]['inviteid']+'">Link</a>';
    }
    append = append+data[i]['address']
    append = append+'</td><td>';

    append = append+data[i]['steempower']
    append = append+'</td><td>';

    append = append+data[i]['created']
    append = append+'</td><td>';

    append = append+data[i]['validity']
    append = append+'</td><td>';

    append = append+data[i]['remaining']
    append = append+'</td><td>';

    append = append+data[i]['accepted']
    append = append+'</td><td>';

    if(data[i]['account'] != null) {
      steempervest = properties.global.total_vesting_fund_steem.slice(0,-6) / properties.global.total_vesting_shares.slice(0,-6);
      vests = Math.ceil(data[i]['steempower'] / steempervest);
      link = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createModal" id="createModalButton'+data[i]['account']+'" data-username="'+data[i]['account']+'">';
      link = link+'Create account @'+data[i]['account']+'</button>';      
      append = append+link;
    }

    append = append+'</td></tr>';

    let elem = document.getElementById('pendingInvites');
    elem.innerHTML = elem.innerHTML + append;
  }

  // add onclick handlers after appending everything, as a new append will destroy them
  for(var i = 0, len = data.length; i < len; i++) {
    if(data[i]['account'] != null) {
      inviteData[data[i]['account']] = data[i];
      document.getElementById('createModalButton'+data[i]['account']).onclick = function() {
        account = this.dataset.username;
        setValueById('createAccountName',inviteData[account]['account']);
        setValueById('createSP',inviteData[account]['steempower']);
        setValueById('createCreator',inviteData[account]['username']);
        setValueById('createOwner',inviteData[account]['owner']);
        setValueById('createActive',inviteData[account]['active']);
        setValueById('createPosting',inviteData[account]['posting']);
        setValueById('createMemo',inviteData[account]['memo']);
      };
    }
  }

  if(pending_invites > 0) {
    $("#openInvites").show();
  } else {
    $("#openInvites").hide();
  }
}
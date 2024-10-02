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
}

function updateBalanceState() {
}

function fillTable() {
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

// fill in data
function fillLoggedIn() {
  if(account == null) {
    return 0;
  }
  if(properties.chain === null || state['current_mana'] == 0) {
    hive.api.getChainProperties(function(err, result) {
      properties.chain = result;
      fillLoggedIn();
    });
    return 0;
  }
  remaining_invites = account.pending_claimed_accounts - pending_invites;
  setContentById('abletoclaim',i18next.t('index.abletoclaim',{'count': remaining_invites}));
  if(remaining_invites > 0) {
    setContentById('pendingclaimsandinvites',i18next.t('index.pendingclaims',{'count': account.pending_claimed_accounts}));
    setContentById('pendingclaims',account.pending_claimed_accounts);
    setContentById('invitespending',i18next.t('index.invitespending',{'count': pending_invites}));

    setContentById('pendinginvites',pending_invites);
    setContentById('invitemore',i18next.t('index.invitemore',{'count': remaining_invites}))
    setContentById('remaininginvites',remaining_invites);
  } else {
    setContentById('pendingclaimsandinvites',i18next.t('index.pendingclaims_zero'));
  }
  let emailText = document.getElementById('emailText').innerHTML;
  setContentById('emailText',emailText.replace("{}",username));

  if(remaining_invites > 0) {
    showById('inviteModalButton');
  } else {
    hideById('inviteModalButton')
  }

  balance = account.balance.slice(0,-6);
  let hivepervest = properties.global.total_vesting_fund_hive.slice(0,-6) / properties.global.total_vesting_shares.slice(0,-6);
  power = Math.round(account.vesting_shares.slice(0,-6) * hivepervest * 1000)/1000;
  
  setContentById('freeClaimModalButton',i18next.t('index.claimfreemodal'));
  setContentById('freeClaimModalLabel',i18next.t('freeclaimmodal.title'));
  setContentById('freeClaimExplainer',i18next.t('freeclaimmodal.explainer'));
  setContentById('freeClaimMoreExplain',i18next.t('freeclaimmodal.moreexplain'));
  setContentById('singleFreeClaim',i18next.t('freeclaimmodal.single'));
  setContentById('multiFreeClaim',i18next.t('freeclaimmodal.multi'));
  setContentById('freeClaimClose',i18next.t('button.close'));

  setContentById('multiClaimModalLabel',i18next.t('multiclaimmodal.title'));
  setContentById('multiClaimExplainer',i18next.t('multiclaimmodal.explainer'));
  setContentById('multiClaimCountLabel',i18next.t('multiclaimmodal.amount'));
  setContentById('multiClaimClaim',i18next.t('button.claim'));
  setContentById('multiClaimClose',i18next.t('button.close'));

  setContentById('paidClaimModalButton',i18next.t('index.claimhivemodal'));
  setContentById('paidClaimModalLabel',i18next.t('paidclaimmodal.title'));
  setContentById('paidClaimExplainer',i18next.t('paidclaimmodal.explainer'));
  setContentById('paidClaimSubmit',i18next.t('button.claim'));
  setContentById('paidClaimClose',i18next.t('button.close'));

  setContentById('inviteModalLabel',i18next.t('invitemodal.title'));
  setContentById('inviteLabelLabel',i18next.t('invitemodal.label'));
  setContentById('inviteByEmailExplainer',i18next.t('invitemodal.by_email'));
  setContentById('inviteEmailLabel',i18next.t('invitemodal.email'));
  setContentById('inviteMailTextLabel',i18next.t('invitemodal.mailtext_label'));
  setContentById('emailText',i18next.t('invitemodal.mailtext').replace('{}','@'+username));
  setContentById('linksAmountLabel',i18next.t('invitemodal.linkamount'));
  setContentById('orSeperator',i18next.t('invitemodal.or'));
  setContentById('multiInviteExplainer',i18next.t('invitemodal.multi'));
  setContentById('multiInvitesLabel',i18next.t('invitemodal.multi_label'));
  setContentById('publicInviteExplainer',i18next.t('invitemodal.public'));
  setContentById('responseTimeLabel',i18next.t('invitemodal.response_time'));
  setContentById('pubDescriptionLabel',i18next.t('invitemodal.public_description'));
  setContentById('requirePhoneExplainer',i18next.t('invitemodal.require_phone'));
  setContentById('requireEmailExplainer',i18next.t('invitemodal.require_email'));
  setContentById('requireRedditExplainer',i18next.t('invitemodal.require_reddit'));
  setContentById('requireFacebookExplainer',i18next.t('invitemodal.require_facebook'));
  setContentById('requireTwitterExplainer',i18next.t('invitemodal.require_twitter'));
  setContentById('requireInstagramExplainer',i18next.t('invitemodal.require_instagram'));
  setContentById('inviteDelegateExplainer',i18next.t('invitemodal.delegate'));
  setContentById('inviteDelegateAmount',i18next.t('invitemodal.delegate_amount'));
  setContentById('inviteValidityExplainer',i18next.t('invitemodal.validity'));
  setContentById('inviteValidityLabel',i18next.t('invitemodal.validity_label'));
  setContentById('inviteUsermailLabel',i18next.t('invitemodal.usermail'));
  setContentById('createInvite',i18next.t('invitemodal.create'));
  setContentById('cancelInvite',i18next.t('button.close'));

  creation_cost_hive = properties.chain.account_creation_fee.slice(0,-6);
  
  setContentByClass('hivecost', properties.chain.account_creation_fee);
  setContentByClass('rccost', formatRC(state['claim_cost_mana']));
  setContentById('maxrc', formatRC(state['max_rc']));
  let rcpct = Math.round(state['current_mana']*100/state['max_rc'] * 100) / 100;
  setContentById('rcpct',rcpct);
  let maxclaims = Math.floor(state['max_rc'] / state['claim_cost_mana']);
  setContentById('canclaimever',i18next.t('index.canclaim',{'count': maxclaims}));
  setContentById('maxclaims', maxclaims);
  setContentById('canclaimnowamount',i18next.t('index.canclaimnow',{'count': Math.floor(state['current_mana'] / state['claim_cost_mana']) - remaining_invites}));
  possibleclaims = Math.floor(maxclaims*rcpct/100);
  setContentByClass('possibleclaims',possibleclaims);
  setValueById('multiClaimCount',Math.min(possibleclaims,100));
  $("#multiClaimCount").attr({'max': Math.min(possibleclaims,100)});
  return 0;
}

inviteData = {}
function insertIntoTable(data) {
  setContentById('openInvitesTitle',i18next.t('openinvitestable.title'));
  setContentById('openInvitesLabel',i18next.t('openinvitestable.label'));
  setContentById('openInvitesLink',i18next.t('openinvitestable.link'));
  setContentById('openInvitesDelegation',i18next.t('openinvitestable.delegation'));
  setContentById('openInvitesCreated',i18next.t('openinvitestable.created'));
  setContentById('openInvitesValid',i18next.t('openinvitestable.valid'));
  setContentById('openInvitesRemaining',i18next.t('openinvitestable.remaining'));
  setContentById('openInvitesAccepted',i18next.t('openinvitestable.accepted'));
  setContentById('openInvitesActions',i18next.t('openinvitestable.actions'));

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

    append = append+data[i]['hivepower']
    append = append+'</td><td>';

    append = append+data[i]['created']
    append = append+'</td><td>';

    append = append+data[i]['validity']
    append = append+'</td><td>';

    append = append+data[i]['remaining']
    append = append+'</td><td>';

    append = append+data[i]['accepted']
    append = append+'</td><td>';

    let id = data[i]['inviteid'];
    if(data[i]['account'] != null) {
      hivepervest = properties.global.total_vesting_fund_hive.slice(0,-6) / properties.global.total_vesting_shares.slice(0,-6);
      vests = Math.ceil(data[i]['hivepower'] / hivepervest);
      link = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createModal" id="createModalButton'+data[i]['account']+'" data-inviteid="'+data[i]['inviteid']+'">';
      link = link+'</button>';
      id = data[i]['account']
    } else {
      link = '<button type="button" class="hidden" id="createModalButton'+id+'" data-inviteid="'+id+'"></>';
    }
    append = append+link+'<button type="button" class="btn btn-primary" id="deleteInviteButton'+id+'" data-inviteid="'+data[i]['inviteid']+'"></button></td></tr>';

    let elem = document.getElementById('pendingInvites');
    elem.innerHTML = elem.innerHTML + append;

    if(id != data[i]['inviteid']) {
      setContentById('createModalButton'+data[i]['account'],i18next.t('openinvitestable.create'));
      document.getElementById('createModalButton'+data[i]['account']).innerHTML = document.getElementById('createModalButton'+data[i]['account']).innerHTML + data[i]['account'];
    }
    setContentById('deleteInviteButton'+id,i18next.t('openinvitestable.delete'));
  }

  // add onclick handlers after appending everything, as a new append will destroy them
  for(var i = 0, len = data.length; i < len; i++) {
    let id = data[i]['inviteid'];
    if(data[i]['account'] != null) {
      id = data[i]['account'];
    }
      
    inviteData[data[i]['inviteid']] = data[i];
    if(id != data[i]['inviteid']) {
      document.getElementById('createModalButton'+id).onclick = function() {
        let id = this.dataset.inviteid;
        setValueById('createAccountName',inviteData[id]['account']);
        setValueById('createSP',inviteData[id]['hivepower']);
        setValueById('createCreator',inviteData[id]['username']);
        setValueById('createOwner',inviteData[id]['owner']);
        setValueById('createActive',inviteData[id]['active']);
        setValueById('createPosting',inviteData[id]['posting']);
        setValueById('createMemo',inviteData[id]['memo']);
      };
    }
    document.getElementById('deleteInviteButton'+id).onclick = function() {
      if(confirm('Really delete invitation? All data will be lost!')) {
        let id = this.dataset.inviteid;
        $.ajax({
          url: "api/delete",
          data: {
            account: ' ',
            delid: id
          },
          type: "POST"
        }).fail(function(){
          alert('something went wrong');
        }).done(function( data ) {
          if(data['error']) {
            alert(data['error']);
          } else {
            alert('Invite deleted');
            getInvites();
          }
        });
      }
    }
  }

  if(pending_invites > 0) {
    $("#openInvites").show();
  } else {
    $("#openInvites").hide();
  }
}

document.getElementById('singleFreeClaim').onclick = function() {
  showById('gearsSingleFreeClaim');
  hideById('multiFreeClaim');
  hideById('singleFreeClaim');

  callback = function(response) {
    hideById('gearsSingleFreeClaim');
    showById('multiFreeClaim');
    showById('singleFreeClaim');
    claimcallbacks(response, $("#freeClaimModal"));
  }
  claim_account(callback);  
}

document.getElementById('multiClaimClaim').onclick = function() {
  showById('gearsMultiClaimClaim');
  hideById('multiClaimClaim');

  callback = function(response) {
    hideById('gearsMultiClaimClaim');
    showById('multiClaimClaim');
    claimcallbacks(response, $("#multiClaimModal"));
  }
  claim_account(callback,$("#multiClaimCount").val());
}

document.getElementById('paidClaimSubmit').onclick = function() {
  showById('gearsPaidClaim');
  hideById('paidClaimSubmit');

  callback = function(response) {
    hideById('gearsPaidClaim');
    showById('paidClaimSubmit');
    claimcallbacks(response, $("#paidClaimModal"));
  }
  claim_account(callback,1,'3');
}

function claimcallbacks(response, modal) {
  if(response.success != 1) {
    if(response.error === 'user_cancel') {
      alert('Claim canceled');
    } else {
      console.log(response.error);
    }
  } else {
    calculateRC();
    alert(response.message);
    modal.modal('hide');
  }
  setProperties();
}

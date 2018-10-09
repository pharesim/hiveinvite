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
    document.getElementById('loggedIn').style.display = 'none';
    i18next.changeLanguage(elem.value);    
    translateIndexContent();
    setProperties();
  }
}

$("#logoutButton").click(function(e){
  e.preventDefault();
  localStorage.removeItem("username");
  window.location.href = "/";
});

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
      translateIndexContent();
      fillLoggedIn();
    }
  });
}

// fill in data
function fillLoggedIn() {
  claim_cost_steem   = properties.chain.account_creation_fee.slice(0,-6);
  balance            = account.balance.slice(0,-6);

  let pct = current_mana * 100 / max_rc;

  let emailText = document.getElementById('emailText').innerHTML;

  let maxclaims = Math.floor(max_rc / claim_cost_mana);
  let possibleclaims = Math.floor(current_mana / claim_cost_mana);
  if(maxclaims > 0) {
    setContentById('canclaimever',i18next.t('index.canclaim',{'count': maxclaims}));
    setContentById('maxclaims',maxclaims);
    document.getElementById('canclaimnow').style.display = 'block';
  } else {
    setContentById('canclaimever',i18next.t('index.cannotclaim'));
    document.getElementById('canclaimnow').style.display = 'none';
  }

  setContentById('freeExplainAmount',i18next.t('freeclaimmodal.explainamount',{'count': possibleclaims}));
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
  } else {
    setContentById('canclaimnowamount',i18next.t('index.cannotclaimnow'));
  }

  steem_accounts = Math.floor(balance / claim_cost_steem);
  if(steem_accounts > 0) {
    setContentById('abletopayforclaim',i18next.t('index.canbuy',{'count': steem_accounts}));
    setContentById('possiblebuys',steem_accounts);
  } else {
    setContentById('abletopayforclaim',i18next.t('index.cannotbuy'));
  }

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

  setContentById('maxrc',formatRC(max_rc));
  setContentById('rcpct',Math.round(pct * 100) / 100);
  setContentById('loggedInUser',username);
  setContentById('steembalance',account.balance);
  setContentById('emailText',emailText.replace("{}",username));
  setContentById('currentrc',formatRC(current_mana));

  setContentByClass('steemcost',properties.chain.account_creation_fee);
  setContentByClass('rccost',formatRC(claim_cost_mana));

  let showButton = 'hide';
  if(remaining_invites > 0) {
    showButton   = 'block';
  }
  document.getElementById('inviteModalButton').style.display = showButton;
  
  if(steem_accounts > 0) {
    document.getElementById('claimsteembutton').style.display = 'block';
  } else {
    document.getElementById('claimsteembutton').style.display = 'none';
  }

  if(possibleclaims > 0) {
    document.getElementById('claimfreebutton').style.display = 'block';
  } else {
    document.getElementById('claimfreebutton').style.display = 'none';
  }

  document.getElementById('loggedIn').style.display = 'block';
}

function insertIntoTable(data) {
  $("#pendingInvites").empty();
  pending_invites = 0
  for(var i = 0, len = data.length; i < len; i++) {
    pending_invites += 1;
    let append = '<tr class="row'+data[i]['account']+'"><td>';

    append = append+data[i]['label'];
    append = append+'</td><td>';

    if(data[i]['address'] == null) {
      data[i]['address'] = '<a href="https://steeminvite.com/accept.html?inviteid='+data[i]['inviteid']+'">Link</a>';
    }
    append = append+data[i]['address']
    append = append+'</td><td>';

    append = append+data[i]['steempower']
    append = append+'</td><td>';

    append = append+data[i]['created']
    append = append+'</td><td>';

    append = append+data[i]['validity']
    append = append+'</td><td>';

    append = append+data[i]['accepted']
    append = append+'</td><td>';

    if(data[i]['account'] != null) {
      steempervest = properties.global.total_vesting_fund_steem.slice(0,-6) / properties.global.total_vesting_shares.slice(0,-6);
      vests = Math.ceil(data[i]['steempower'] / steempervest);
      link = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createModal" id="createModalButton'+data[i]['account']+'">';
      link = link+'Create account @'+data[i]['account']+'</button>';      
      append = append+link;
    }

    append = append+'</td></tr>';

    $("#pendingInvites").append(append);

    if(data[i]['account'] != null) {
      let tmp = data[i];
      $("#createModalButton"+data[i]['account']).click(function(e){
        $("#createAccountName").val(tmp['account']);
        $("#createSP").val(tmp['steempower']);
        $("#createCreator").val(tmp['username']);
        $("#createOwner").val(tmp['owner']);
        $("#createActive").val(tmp['active']);
        $("#createPosting").val(tmp['posting']);
        $("#createMemo").val(tmp['memo']);
      });
    }

  }

  if(pending_invites > 0) {
    $("#openInvites").show();
  } else {
    $("#openInvites").hide();
  }
}
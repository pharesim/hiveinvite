document.getElementById('loginButton').onclick = function() {
  hideById('loginButtonContainer');
  showById('loginFormContainer');
}

document.getElementById('loginNow').onclick = function() {
  let loginUser = getValueById('loginUsername');
  let loginKey  = getValueById('loginPostingKey');
  if(steem.auth.isWif(loginKey)) {
    loginKey = loginKey;
  } else {
    loginKey = steem.auth.toWif(loginUser, loginKey, 'posting');
  }

  let pub = steem.auth.wifToPublic(loginKey);
  steem.api.getAccounts([loginUser], function(err, result) {
    let keys = result[0]['posting']['key_auths'];
    for (var i = 0; i < keys.length; i++) {
      if(keys[i][0] == pub) {
        localStorage.setItem("username", result[0]['name']);
        hideById('loginError');
        appstart();
      }
    }

    if(username == '') {
      setContentById('loginError',i18next.t('keys.wrong_key'));
      showById('loginError');
    }
  });
}
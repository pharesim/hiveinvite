document.getElementById('loginButton').onclick = function() {
  hideById('loginButtonContainer');
  showById('loginFormContainer');
}

document.getElementById('loginNow').onclick = function() {
  let name = getValueById('loginUsername');
  const keychain = window.hive_keychain;
  const signedMessageObj = { type: 'login', address: name, page: window.location.href };
  const messageObj = { signed_message: signedMessageObj, timestamp: parseInt(new Date().getTime() / 1000, 10) };
  keychain.requestSignBuffer(name, JSON.stringify(messageObj), 'Posting', (response) => {
    if (!response.success) { return; }
    $.ajax({
      url: "api/invite",
      data: response,
      type: "POST"
    }).fail(function(){
      alert('something went wrong');
      reenableInvite();
    }).done(function( data ) {
      localStorage.setItem("username", name);
      hideById('loginError');
      appstart();

      if(username == '') {
        setContentById('loginError',i18next.t('keys.wrong_key'));
        showById('loginError');
      }
    });
  });
}

$("#loginUsername").keyup(
  function(){
    newname = $(this).val().toLowerCase().replace(/[^a-z0-9.-]+/g, "");
    if(newname.lenth > 15) {
      newname = newname.substr(0,15);
    }
    $(this).val(newname);
  }
);
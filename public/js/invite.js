function validateModalForm() {
  let fails = 0;
  $(".required").each(function(){
    if($(this).val().length == 0) {
      fails++;
    }
  });

  if($("#inviteByEmail").is(':checked') && !isEmail($("#inviteEmail").val())) {
    fails++;
  }

  if(!isEmail($("#inviteUsermail").val())) {
    fails++;
  }

  if(fails == 0) {
    $("#createInvite").removeAttr("disabled");
    return true;
  }

  $("#createInvite").prop('disabled',true);
  return false;
}

function reenableInvite() {
  $("#createInvite").show();
  $("#gearsInvite").hide();
}

hideByClass("noEmail");
$("#inviteByEmail").click(function(){
  if($(this).is(':checked')){
    $(".sendEmail").show();
    hideByClass("noEmail");
    hideByClass("multiInvites");
    hideByClass("publicInvites");
    document.getElementById("linksAmount").value = 1;
    document.getElementById("multiInviteAmount").value = 1;
    document.getElementById("multiInvite").checked = false;
  } else {
    $(".sendEmail").hide();
    showByClass("noEmail");
  }
});

hideByClass("multiInvites");
$("#multiInvite").click(function(){
  if($(this).is(':checked')){
    showByClass("multiInvites");
    hideById("linksAmountDiv");
    document.getElementById("linksAmount").value = 1;
  } else {
    hideByClass("multiInvites");
    showById("linksAmountDiv");
    document.getElementById("multiInviteAmount").value = 1;
  }
});

hideByClass("publicInvites");
$("#publicInvite").click(function(){
  if($(this).is(':checked')){
    showByClass("publicInvites");
  } else {
    hideByClass("publicInvites");
    document.getElementById("requirePhone").checked = false;
    document.getElementById("requireEmail").checked = false;
    document.getElementById("requireReddit").checked = false;
    document.getElementById("requireFacebook").checked = false;
    document.getElementById("requireTwitter").checked = false;
    document.getElementById("requireInstagram").checked = false;
  }
});

document.getElementById("linksAmount").oninput = function() {
  if(this.value > remaining_invites) {
    this.value = remaining_invites;
    alert("You can't create more than "+remaining_invites+" links");
  } else if(this.value < 1) {
    this.value = 1;
  }
}

$(".required, #inviteByEmail, #inviteEmail, #inviteUsermail").change(function(){validateModalForm();});

$("#createInvite").click(function(e){
  e.preventDefault();
  $(this).hide();
  $("#gearsInvite").show();
  if(validateModalForm()){
    $.ajax({
      url: "api/invite",
      data: {
        label: document.getElementById("inviteLabel").value,
        email: $("#inviteByEmail").is(":checked"),
        address: document.getElementById("inviteEmail").value,
        mailtext: document.getElementById("emailText").value,
        amount: document.getElementById("linksAmount").value,
        multi: document.getElementById("multiInviteAmount").value,
        public: $("#publicInvite").is(":checked"),
        response_time: document.getElementById("responseTime").value,
        pub_description: document.getElementById("pubDescription").value,
        require_phone: $("#requirePhone").is(":checked"),
        require_email: $("#requireEmail").is(":checked"),
        require_reddit: $("#requireReddit").is(":checked"),
        require_facebook: $("#requireFacebook").is(":checked"),
        require_twitter: $("#requireTwitter").is(":checked"),
        require_instagram: $("#requireInstagram").is(":checked"),
        sp: document.getElementById("inviteSP").value,
        validity: document.getElementById("inviteValidity").value,
        usermail: document.getElementById("inviteUsermail").value,
        username: username
      },
      type: "POST"
    }).fail(function(){
      alert('something went wrong');
      reenableInvite();
    }).done(function( data ) {
      if(data['error']) {
        alert(data['error']);
      } else {
        insertIntoTable(data);
        calculateRC();
        fillLoggedIn();
        $("#inviteModal").modal('hide');
        $("#inviteEmail, #inviteLabel").val("");
        document.getElementById("linksAmount").value = 1;
        document.getElementById("multiInviteAmount").value = 1;
      }

      reenableInvite();
    });
  }
});

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
        label: $("#inviteLabel").val(),
        email: $("#inviteByEmail").is(":checked"),
        address: $("#inviteEmail").val(),
        mailtext: $("#emailText").val(),
        amount: document.getElementById("linksAmount").value,
        multi: document.getElementById("multiInviteAmount").value,
        sp: $("#inviteSP").val(),
        validity: $("#inviteValidity").val(),
        usermail: $("#inviteUsermail").val(),
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
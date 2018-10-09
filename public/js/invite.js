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

$("#inviteByEmail").click(function(){
  if($(this).is(':checked')){
    $(".sendEmail").show();
  } else {
    $(".sendEmail").hide();
  }
});

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
        fillLoggedIn();
        $("#inviteModal").modal('hide');
        $("#inviteEmail, #inviteLabel").val("");
      }

      reenableInvite();
    });
  }
});
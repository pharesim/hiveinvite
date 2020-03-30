function getInvites() {
  $.ajax({
    url: "api/public",
    type: "GET"
  }).fail(function(){
    alert('something went wrong');
  }).done(function( data ) {
    if(data['error']) {
      alert(data['error']);
    } else {
      fillPublicTable(data);
    }
  });
}

function fillPublicTable(data) {
  // @todo refactor in own function to get rid of jquery
  $("#publicInvites").empty();
  public_invites = 0
  for (var i in data) {
    public_invites += 1;
    let append = '<tr><td>';

    append = append+'<a href="https://hive.blog/@'+data[i]['user']+'">'+data[i]['user']+'</a>';
    append = append+'</td><td>';

    append = append+data[i]['data']['delegation']+' HP';
    append = append+'</td><td>';

    append = append+data[i]['data']['description'];
    append = append+'</td><td>';

    checks = ['phone','mail','reddit','fb','twitt','insta'];
    checks.forEach(function(type){
      if(data[i]['data']['ask_'+type] == 'true') {
        append = append+'<img src="/img/'+type+'.svg" width="16" height="16" />';
      }
    });

    append = append+'</td><td>';

    append = append+'about '+data[i]['data']['responset']+' hours';
    append = append+'</td><td>';

    append = append+data[i]['data']['remaining'];
    append = append+'</td><td>';

    append = append+'<a href="https://hiveinvite.com/accept.html?inviteid='+i+'">Claim</a>';
    append = append+'</td></tr>';

    let elem = document.getElementById('publicInvites');
    elem.innerHTML = elem.innerHTML + append;
  }

  if(public_invites > 0) {
    $("#invites").show();
  } else {
    $("#invites").hide();
  }
}

getInvites();

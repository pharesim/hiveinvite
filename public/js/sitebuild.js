function loadTemplate(template,container) {
  jQuery.ajaxSetup({ async: false });
  $.get('templates/'+template+'.html', '', function (data) {
    let elem = document.getElementById(container);
    elem.innerHTML = data+elem.innerHTML;
  });
  jQuery.ajaxSetup({ async: true });
}

loadTemplate('index/loggedout','content');
loadTemplate('index/loggedin','content');
loadTemplate('index/modals/freeclaim','body');
loadTemplate('index/modals/botclaim','body');
loadTemplate('index/modals/paidclaim','body');
loadTemplate('index/modals/invite','body');
loadTemplate('index/modals/create','body');

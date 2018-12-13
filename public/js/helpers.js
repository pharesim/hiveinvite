//*** js helper functions ***/

function hideById(id) {
  document.getElementById(id).style.display = 'none';
}

function hideByClass(classname) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.display = 'none';
  }
}

function showById(id) {
  document.getElementById(id).style.display = 'block';
}

function showByClass(classname) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.display = 'block';
  }
}

function getValueById(id) {
  return document.getElementById(id).value;
}

function setContentById(id,content) {
  document.getElementById(id).innerHTML = content;
}

function setContentByClass(classname,content) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].innerHTML = content;
  }
}

function setValueById(id,value) {
  document.getElementById(id).value = value;
}

function setValuesByClass(classname,value) {
  let elems = document.getElementsByClassName(classname);
  for (let i = 0; i < elems.length; i++) {
    elems[i].value = value;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function increment(elem) {
  elem.innerHTML = parseInt(elem.innerHTML) + 1;
  return true;
}
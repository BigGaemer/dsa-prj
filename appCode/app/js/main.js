// prevent load content from outside of app by drag&drop
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());

let searchMode = false;
let searchBox = document.querySelector('#search-box');

searchBox.addEventListener('input', (event) => {
  nodeIpc.send('db', 'getFiltered', searchBox.value);
});

let personItemTemplate = null;

// import all templates file
let imports = document.querySelectorAll('link[rel=import]');
for (let link of imports) {
  let template = link.import.querySelector('template');

  if (template.classList.contains('person-item')) {
    personItemTemplate = template;
  } else {
    let clone = document.importNode(template.content, true);
    document.querySelector('.content').appendChild(clone);
  }
}

// check the url for action like close, minimize, back or change the page section, etc
window.addEventListener('hashchange', (event) => {
  let target = window.location.hash.substring(1, window.location.hash.length);

  switch (target) {
    case 'back':
      goBack();
      break;
    case 'quit':
      nodeIpc.send('app', 'quit');
      break;
    case 'minimize':
      nodeIpc.send('app', 'minimize');
      break;
    case 'add-person':
      addPerson();
      break;
    default:
      goTo(target);
  }

});

// set all anchor tag to add the page to page stack for navigation use
let anchors = document.querySelectorAll('a[href]');
for (let a of anchors) {
  const url = a.getAttribute('href');
  if (url.indexOf('http') === 0) {
    a.addEventListener('click', (event) => {
      event.preventDefault();
      nodeShell.openExternal(url);
    });
  }
}

let navMenuButton = document.querySelector('#nav-btn-menu');
let navBackButton = document.querySelector('#nav-btn-back');
let navTitle = document.querySelector('#nav-title');

// switch the nav-menu button with nav-back button
function checkPageNav() {
  if (pageStack.length > 1) {
    navMenuButton.classList.add('hide');
    navBackButton.classList.remove('hide');
  } else {
    navMenuButton.classList.remove('hide');
    navBackButton.classList.add('hide');
  }
}

function setTitle(title) {
  navTitle.innerText = title;
}

// show the page that user wants
function goTo(page) {
  searchBox.classList.add('hide');
  if (page === 'index') {
    searchMode = false;
  }

  if (page === 'search') {
    page = 'persons-list';
    searchMode = true;
  }

  if (page === 'persons-list') {
    if (!searchMode) {
      nodeIpc.send('db', 'getAll');
    } else {
      nodeIpc.send('db', 'getFiltered', searchBox.value);
      searchBox.classList.remove('hide');
    }
  }

  if (page.includes('/')) {
    currentPersonId = page.substring(page.indexOf('/') + 1, page.length);
    nodeIpc.send('db', 'getSingle', {':id': currentPersonId});

    page = page.substring(0, page.indexOf('/'));
  }

  pageStack.push(page);
  checkPageNav();

  // Switch the section visibility and show any effect we want
  let newSection = document.querySelector('#section-' + page);

  if (currentSection) {
    currentSection.classList.add('hide');
  }

  if (newSection && newSection.classList.contains('hide')) {
    newSection.classList.remove('hide');
    currentSection = newSection;
  }

  setTitle(newSection.dataset.title);

}

// Go one level back in page stack
function goBack() {
  if (pageStack.slice(-1)[0] === 'persons-list') {
    clearPersonList();
  }

  window.location.hash = pageStack.slice(-2)[0];
  pageStack = pageStack.slice(0, pageStack.length - 2);
  checkPageNav();
}

goTo('index');  // Load the index main content from the template

let nameField = document.querySelector('#name');
let emailField = document.querySelector('#email');
let telField = document.querySelector('#tel');
let addForm = document.querySelector('#add-form');

function addPerson() {
  nodeIpc.send('db', 'add', {':name': nameField.value, ':email': emailField.value, ':tel': telField.value});

  // clearField
  addForm.reset();
  nameField.focus();

  // Show added message
  Materialize.toast('Person added', 3000);

  // goBack();
}

function showPersonsList(values) {
  clearPersonList();

  for (let person of values) {
    let item = document.importNode(personItemTemplate.content, true);

    item.querySelector('a').href = '#person/' + person.id;
    item.querySelector('#name').innerText = person.name;
    item.querySelector('#email').innerText = person.email;
    item.querySelector('#tel').innerText = person.tel;

    document.querySelector('#persons-collection').appendChild(item);
  }
}

function clearPersonList() {
  let collection = document.querySelector('#persons-collection');
  while (collection.firstChild) {
    collection.removeChild(collection.firstChild);
  }
}

let singleName = document.querySelector('#single-name');
let singleEmail = document.querySelector('#single-email');
let singleTel = document.querySelector('#single-tel');

let singleNameField = document.querySelector('#name-field');
let singleEmailField = document.querySelector('#email-field');
let singleTelField = document.querySelector('#tel-field');

function showSinglePerson(values) {
  cancelEdit();
  cancelDelete();

  singleName.innerText = values.name;
  singleEmail.innerText = values.email;
  singleTel.innerText = values.tel;

  singleNameField.value = values.name;
  singleEmailField.value = values.email;
  singleTelField.value = values.tel;
}

nodeIpc.on('dbResult', (event, type, values) => {
  switch (type) {
    case 'resultAll':
      showPersonsList(values);
      break;
    case 'resultSingle':
      showSinglePerson(values);
      break;
  }
});

let personInfo = document.querySelector('#person-info');
let deletePerson = document.querySelector('#delete-person');
let editPerson = document.querySelector('#edit-person');


function showDelete(event) {
  personInfo.classList.add('hide');
  deletePerson.classList.remove('hide');
}

function cancelDelete(event) {
  deletePerson.classList.add('hide');
  personInfo.classList.remove('hide');
}

function showEdit(event) {
  personInfo.classList.add('hide');
  editPerson.classList.remove('hide');
}

function cancelEdit(event) {
  editPerson.classList.add('hide');
  personInfo.classList.remove('hide');
}

function saveEdit(event) {
  nodeIpc.send(
    'db',
    'edit',
    {
      ':id': currentPersonId,
      ':name': singleNameField.value,
      ':email': singleEmailField.value,
      ':tel': singleTelField.value
    }
  );
}


function saveDelete(event) {
  nodeIpc.send('db', 'delete', {':id': currentPersonId});
  
  goBack();
}

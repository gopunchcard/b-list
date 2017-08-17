var urlRoot = 'http://localhost:3010/api';

function onButtonClick() {
  /*
  let filters = [];

  let filterService = document.querySelector('#service').value;
  if (filterService.startsWith('0x')) {
    filterService = parseInt(filterService);
  }
  if (filterService) {
    filters.push({services: [filterService]});
  }

  let filterName = document.querySelector('#name').value;
  if (filterName) {
    filters.push({name: filterName});
  }

  let filterNamePrefix = document.querySelector('#namePrefix').value;
  if (filterNamePrefix) {
    filters.push({namePrefix: filterNamePrefix});
  }

  let options = {};
  if (document.querySelector('#allDevices').checked) {
    options.acceptAllDevices = true;
  } else {
    options.filters = filters;
  }
  */
  let options = {};
  options.acceptAllDevices = true;

  console.log('Requesting Bluetooth Device...');
  console.log('with ' + JSON.stringify(options));
  navigator.bluetooth.requestDevice(options)
    .then(device => {
      console.log('> Name:             ' + device.name);
      console.log('> Id:               ' + device.id);
      console.log('> Connected:        ' + device.gatt.connected);
    })
    .catch(error => {
      console.log('Argh! ' + error);
    });
}

function saveUser() {
  var mac = document.getElementById('mac').value;
  var roomEl = document.getElementById('room');
  var room = roomEl.options[roomEl.selectedIndex].value;
  var name = document.getElementById('name').value;
  var company = document.getElementById('company').value;

  var user = {
    mac,
    room,
    name,
    company
  };

  var fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  };

  fetch(urlRoot + '/user', fetchOptions)
    .then(showToast());
}

function showToast() {
  toastr.options = {
    "positionClass": "toast-custom toast-top-center"
  }

  toastr.success('Save success!');
}
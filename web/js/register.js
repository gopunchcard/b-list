var urlRoot = 'http://localhost:3010/api';

const MAC_ADDRESS_LENGTH = 17;
var macAddress = document.getElementById("mac");
macAddress.addEventListener("keyup", formatMac, false);

function formatMac(e) {
  var r = /([a-f0-9]{2})([a-f0-9]{2})/i,
    str = e.target.value.replace(/[^a-f0-9]/ig, "");

  while (r.test(str)) {
    str = str.replace(r, '$1' + ':' + '$2');
  }

  e.target.value = str.slice(0, 17);
};

function findMac() {
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

  if (!checkValidation(mac, name)) {
    return false;
  }

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
    .then(showToastSuccess('Save Success!'));
}

function checkValidation(mac, name) {
  var valid = true

  var macError = document.getElementById('mac-error');
  var nameError = document.getElementById('name-error');

  if (mac.length !== MAC_ADDRESS_LENGTH) {
    macError.innerHTML = 'MAC address is invalid.';
    valid = false;
  } else {
    macError.innerHTML = '';
  }
  if (name === "") {
    nameError.innerHTML = 'Name cannot be empty.';
    valid = false;
  } else {
    nameError.innerHTML = '';
  }

  return valid;
}

function showToastSuccess(msg) {
  toastr.options = {
    "positionClass": "toast-custom toast-top-center"
  }

  toastr.success(msg);
}

# #from bluetooth.ble import DiscoveryService
# import bluetooth
# import json
# import requests
# import time

# url = 'http://10.0.1.184:3010/bluetooth'

# while True:
# 	nearby_devices = bluetooth.discover_devices(duration=20, lookup_names=True)
# 	print("found %d devices" % len(nearby_devices))
# 	for addr, name in nearby_devices:
# 		payload = { 'mac': str(addr) }
# 		headers = {'content-type': 'application/json'}
# 		requests.post(url, data=json.dumps(payload), headers=headers)

# 	time.sleep(60)
	# service = DiscoveryService()
	# devices = service.discover(2)
	# for address, name in devices.items():
		# print("name: {}, address: {}".format(name, address))

#!/usr/bin/python

import bluetooth
import time
import requests
import json

urlRoot = 'http://localhost:3010'



while True:
    print "Checking " + time.strftime("%a, %d %b %Y %H:%M:%S", time.gmtime())

    macAddresses = requests.get(urlRoot+'/bluetooth/macAddresses')
  
    for addr in macAddresses.json():
        print "Address: "+addr

    result = bluetooth.lookup_name('70:3E:AC:A1:0B:AA', timeout=5)
    if (result != None):
        print "Estyn: in"
        payload = { 'mac': str('70:3E:AC:A1:0B:AA') }
        headers = {'content-type': 'application/json'}
        requests.post(urlRoot+'/bluetooth', data=json.dumps(payload), headers=headers)
    else:
        print "Estyn: out"
		
    time.sleep(60)
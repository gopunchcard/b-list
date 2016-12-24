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

url = 'http://10.0.1.184:3010/bluetooth'

while True:
    print "Checking " + time.strftime("%a, %d %b %Y %H:%M:%S", time.gmtime())

    result = bluetooth.lookup_name('1C:66:AA:CF:DD:35', timeout=5)
    if (result != None):
       payload = { 'mac': str('1C:66:AA:CF:DD:35') }
		headers = {'content-type': 'application/json'}
		requests.post(url, data=json.dumps(payload), headers=headers)
    else:
        print "Estyn: out"
		
    time.sleep(60)
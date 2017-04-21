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

urlRoot = 'http://10.0.1.9:3010'

def CheckForMacs():
    try:
        print "Checking " + time.strftime("%a, %d %b %Y %H:%M:%S", time.gmtime())

        macAddresses = requests.get(urlRoot+'/bluetooth/macAddresses')
    
        for addr in macAddresses.json():
            result = bluetooth.lookup_name(addr, timeout=5)
            if (result != None):
                print addr+": in"
                payload = { 'mac': str(addr) }
                headers = {'content-type': 'application/json'}
                requests.post(urlRoot+'/bluetooth', data=json.dumps(payload), headers=headers)
            else:
                print addr+": out"
                
    except Exception as err:
        print "Error during check: ", err
    finally:
        print "Done Checking " + time.strftime("%a, %d %b %Y %H:%M:%S", time.gmtime())
        return

while True:
    CheckForMacs()
    time.sleep(45)
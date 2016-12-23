import bluetooth
import json
import requests
import time

url = 'http://10.0.1.184:3010/bluetooth'

while True:
	nearby_devices = bluetooth.discover_devices(duration=20, lookup_names=True)
	for addr, name in nearby_devices:
		payload = { 'mac': str(addr) }
		headers = {'content-type': 'application/json'}
		requests.post(url, data=json.dumps(payload), headers=headers)

	time.sleep(60)


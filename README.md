# b-list
An in out board for our co-working space

to view  the detector or api output use the following commands
ps aux | grep *detector.py/index.js*
strace -e trace=write -s1000 -fp 22711 2>&1 | grep -o '".\+[^"]"'
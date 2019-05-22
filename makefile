port = 3000

getvideo: downloads
	cd Developments/getvideo && yarn start
port:
	netstat -vanp tcp | grep ${port}
killit: port
	lsof -ti:${port} | xargs kill
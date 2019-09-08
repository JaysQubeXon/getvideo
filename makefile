port = 1717

getvideo: init
	node ./dist/server/index.js	
port:
	netstat -vanp tcp | grep ${port}
killit: port
	lsof -ti:${port} | xargs kill

killmon:
	lsof -ti:${port} | xargs kill

init:
	open http://localhost:${port}
build:
	yarn build
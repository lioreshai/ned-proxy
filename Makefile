build:
	npm install
	tsc
	docker build -t lioreshai/node-dind-executor .
clean:
test:
deploy:
run:
	docker run -it --rm -p 8085:80 lioreshai/node-dind-executor
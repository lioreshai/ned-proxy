build:
	npm install
	tsc
	docker-compose build
clean:
	docker-compose down
test:
deploy:
	docker build -t liore/ned-proxy .
	docker push liore/ned-proxy
run:
	docker-compose down
	docker-compose up -d
	docker-compose logs -f
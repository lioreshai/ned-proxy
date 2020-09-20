build:
	npm install
	tsc
	docker-compose build
clean:
	docker-compose down
test:
deploy:
	docker build -t liore/ned-serverless .
	docker push liore/ned-serverless
run:
	docker-compose down
	docker-compose up -d
	docker-compose logs -f
build:
	npm install
	tsc
	docker-compose build
clean:
	docker-compose down
test:
deploy:
run:
	docker-compose down
	docker-compose up -d
	docker-compose logs -f
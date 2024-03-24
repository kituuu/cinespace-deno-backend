build:
	docker build -t cine-deno . 

run-container:
	docker run -it --rm cine-deno

start:
	docker compose up -d

stop:
	docker compose down
## Run local

```bash
cp .env.development .env
docker-compose up
```

## Deploy

```bash
docker build --build-arg STAGE=master -t react-image .

docker run -p 80:80 -d react-image
```

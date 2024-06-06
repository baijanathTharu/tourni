# Testing locally

Create .env file from the sample `example.env` file and run the docker image passing that env file

```sh
docker run --env-file .env --name cron -p 9000:9000 tourni_cron
```

```sh
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"test": "one"}'
```

#!/bin/sh

./gencert.sh crud.docker.localhost
docker-compose -p crud up -d

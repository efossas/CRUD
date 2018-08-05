#!/bin/sh

if [ $# -ne 1 ]
then
        echo "Usage: gencert.sh [name]"
        exit
fi

DOMAIN="$1"

mkdir -p ./ssl

openssl genrsa -des3 -passout pass:x -out ./ssl/crud.pass.key 2048
openssl rsa -passin pass:x -in ./ssl/crud.pass.key -out ./ssl/crud.key
rm ./ssl/crud.pass.key

openssl req -new -key ./ssl/crud.key -out ./ssl/crud.csr -subj "/CN=$DOMAIN"
openssl x509 -req -days 3650 -in ./ssl/crud.csr -signkey ./ssl/crud.key -out ./ssl/crud.crt


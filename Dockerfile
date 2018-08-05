FROM node:alpine

# update, upgrade, & install packages
RUN apk update && apk upgrade
RUN apk add coreutils git openssl wget

# config volume
VOLUME /config

# git clone the repo 
RUN git clone https://github.com/efossas/CRUD /crud

# set working directory
WORKDIR /crud

# install dependencies
RUN npm install --unsafe-perm

# create ssl certificates
RUN chmod 744 /crud/gencert.sh
RUN ash /crud/gencert.sh 'localhost'

# set the command
CMD ["npm","start"]

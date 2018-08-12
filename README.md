# RESTful CRUD
A RESTful CRUD application in seconds using Nodejs, MongoDB, Traefik, Docker, & Kubernetes

## How Does It Work

Traefik is a reverse proxy that routes requests to the different Docker containers. It first hits a Node + ExpressJS server, which in turn uses Redis to store sessions and Mongo to store data.

When the Docker service is spun up, the Node container reads this configuration file: `config/config.json`. That file contains a list of data domains along with its fields and the attributes for each field. For example:

```json
{
  "/dog":
  {
    "_id":
    {
      "type": "text",
      "placeholder": "Enter a unique ID",
      "pattern": "[a-z]+",
      "required": true
    },  
    "name":
    {
      "type": "text",
      "placeholder": "Enter the dog's name"
    }
    "size":
    {
      "type": "single",
      "options": [
        "toy",
        "small",
        "medium",
        "large",
        "extra large"
      ]
    }
  }    
}
```

Then, you can go to `https://crud.docker.localhost/dog` and create data.

You can go to `https://crud.docker.localhost/dog/{field}/{value}` to read, edit, and delete data. For example: `https://crud.docker.localhost/dog/name/lassie`.

## Requirements

You just need `Docker`.

## DNS

The application defaults to `crud.docker.localhost` & the Traefik GUI defaults to `traefik.docker.localhost`. 
You can change this by editing the domain in `traefik.toml` and the Traefik frontend rule labels in `docker-compose.yml`.

You will need to route the domain to your localhost using DNS. The easiest way to do that is to edit `/etc/hosts` and add:
```bash
127.0.0.1   crud.docker.localhost
127.0.0.1   traefik.docker.localhost
```

On Mac, `dnsmasq` is a good tool for custom DNS routing if you don't want to edit `/etc/hosts`.

## Installation

Clone and enter the repo. The `compose.sh` script will generate the SSL key and certificate and run docker compose.

```bash
git clone https://github.com/efossas/CRUD .
```


## Running The Application

```
cd CRUD

./compose.sh
```

## Domain Configuration

Here is a list of the available types of HTML form inputs and their attributes:

##### character data
- text
- secret
- hidden
     
*attributes: placeholder, value, min, max, pattern, required*

##### numeric data
- number

*attributes: placeholder, value, min, max, required*

##### time data
- month
- week
- day
- date
- time

*attributes: value, min, max, required*

##### select data
- single
- multiple
- textlist

*attributes: options[], placeholder (textlist only)*

## Visual Configuration

You can customize the way the application looks by editing `views/template.ejs`.






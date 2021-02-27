# youtube-api
This is a implementation of Youtube Api to manage videos that fetch trending videos from the youtube feed.
Deployed app can be checked from below link.
[https://youtube-bluestacks.herokuapp.com/](https://youtube-bluestacks.herokuapp.com/)

## Prerequisites

First make sure you have following dependencies installed -
* Nodejs 10+
* Mongodb

## Steps
For running this on your machine mongodb should be installed and run along side.
Also mongodb is implemented for local mongodb://localhost:27017, if you want to use your own db server you can change
the following env variables 

* DB_USER=<USERNAME>
* DB_PASS=<DBPASSWORD>
* IS_PROD=true

* For fethcing youtube video you also need to use your own youtube v3 api add place it here
API_KEY=<YOUTUBE_API>


* Next in command line run - ```npm install```
(to install the dependencies)

* To start the server - ```npm start```
(to run the website on your local host 3000. )

* You can also use if developing - ```nodemon start```

## Api Endpoints

* For fetching videos stored in db GET request - ```/api```

* For fetching video by id  GET request - ```/api/<yid>```

* For fetching videos youtube and storing it in db GET request - ```/api/add```

* For deleting all the stored videos DELETE request = ```/api```

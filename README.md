# Chewsit Server

This is the server for chewsit 3.0. Currently being rebuilt using MongoDB and express.

## Client

Visit the front end repository at https://github.com/khuynh92/chewsit-client

## Setup

1. After downloading the simple-server repo, `npm i` to install all packages.

1. create an `.env` file in the root directory.

**Environment Variables**

```
PORT=3000
MONGODB_URI= 'mongodb://localhost/your_mongo_db_name_here
SECRET='your_secret_here'
API_URL='http://localhost:3000'
CLIENT_URL='http://localhost:8080'

GOOGLE_CLIENT_ID = 'google_client_id'
GOOGLE_CLIENT_SECRET = 'google_client_secret'
GOOGLE_API_KEY = 'google_api_key'

LINKEDIN_CLIENT_ID = 'linkedin_client_id'
LINKEDIN_CLIENT_SECRET = 'linkedin_client_secret'

FACEBOOK_APP_ID=
FACEBOOK_SECRET=

PASSWORD='string'

YELP_API_KEY= 'yelp_api_key'
YELP_CLIENT_ID='yelp_client_id'
```

## To Run

`npm run watch`


## API Endpoints

#### `POST /signup`

expects a user object

**Input**

```
{
 username: LeslieKnope2012,
  email: LesLieKnope@pawneepandr.com,
  password: lilsebastion,
}
```

**Output**

JWT token

#### `GET /signin`

**Input**

expects basic auth in the header

**Output**

JWT token

#### `GET /api/v1/profiles`

**Output**

all users in the database. Information listed is limited


#### `GET /api/v1/profiles/id/:id`

**Output**

Finds a single user matching the :id


#### `GET /api/v1/profiles/username/:username`

**Output**

Finds a single user matching the :username


#### `GET /api/v3/yelp/:food/:location/:price/:range/:offset`

**Output**

Array of restaurants

#### `GET /api/v1/yelp/business/:id`

**Output**

Information from a single Business

#### `GET /api/v1/google/:address`

**Output**
```
Object: {
 lat: 1234
 lng: 4567
}
```


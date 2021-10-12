# Messenger

A one-to-one realtime chat app.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

## Initial Setup

Create the PostgreSQL database (these instructions may need to be adapted for your operating system):

```
psql
CREATE DATABASE messenger;
\q
```

Create a `.env` file in the server directory and add the following variables (make any modifications to fit your local installation):
```
SECRET_KEY="YourSecretKey"
ENV="development"
POSTGRES_ENGINE="django.db.backends.postgresql_psycopg2"
POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_DATABASE="messenger"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"

```


In the server folder, install dependencies and then seed the database (you may want to use a virtual environment):

```
cd server
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate 

python manage.py shell
from messenger_backend.seed import seed
seed()
exit()

```

In the client folder, install dependencies:

```
cd client
npm install
```

### Running the Application Locally

In one terminal, start the front end:

```
cd client
npm start
```

In a separate terminal, start the back end:

```
cd server
python manage.py runserver
```

### Running Tests on the Server
```
cd server
python manage.py test
```

## How to Run E2E Tests

1. Seed the database.
1. Start the backend server.
1. Start the frontend server with `npm start` in `client` directory.
1. Open Cypress dashboard with `npx cypress open` in `client` directory.
1. Click on the test suite to run (e.g. `auth.spec.js`).

#### Notes

- You need to seed the database before each run. Because E2E test cases writes data to
  the actual database, re-seeding is necessary to assure consistent test results.
- The E2E tests are not comprehensive.
  There is a test for the authentication pages that should pass with the starting code,
  and some tests for some of the functionality for some of the tickets you will be assigned.
- When you push your changes to GitHub, E2E tests are automatically executed on GitHub Actions.
  You can find test results under Pull request > Checks > test > Cypress (see screenshots below).

![image](https://user-images.githubusercontent.com/8978815/136117299-b45a61ce-0b5c-495f-b572-05ad80b78a28.png)
![image](https://user-images.githubusercontent.com/8978815/136119935-4b941f87-0015-48c5-b93e-5bd0bcbbd64b.png)

